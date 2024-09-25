import { EnvironmentVariables } from '@/common/config'
import { MINUTE } from '@/common/constant'
import { BaseException } from '@/common/exceptions'
import { DatabaseException } from '@/common/exceptions/database'
import { EmailService } from '@/modules/email/email.service'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { GlobalLoggerService, RedisService } from '@lib'
import {
  calculatePasswordStrengthLevel,
  generateBase62Code,
  omit,
} from '@mudssky/jsutils'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import { v4 as uuidV4 } from 'uuid'
import { CreateUserDto } from '../user/dto/user.dto'
import { UserService } from '../user/user.service'
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  SendCaptchaDto,
} from './dto/auth.dto'
import { GithubAuthInfo } from './strategy/github.strategy'
import { GoogleAuthInfo } from './strategy/google.strategy'
import { JwtPayload, LoginRes } from './types'

const captchaPrefixDict = {
  login: 'login_',
  changePassword: 'changePassword_',
  forgetPassword: 'forgetPassword_',
  register: 'register_',
} as const
export type CaptchaType = keyof typeof captchaPrefixDict

@Injectable()
export class AuthService implements OnModuleInit {
  //  private readonly logger = new Logger()

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: GlobalLoggerService,
    private readonly userSevice: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async hashPassword(password: string) {
    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)
    return hash
  }

  joinCaptchaKey(options: { captchaType: CaptchaType; email: string }) {
    const prefix = captchaPrefixDict[options.captchaType]
    return `${prefix}${options.email}`
  }

  async checkCaptcha(options: {
    captcha: string
    captchaType: CaptchaType
    email: string
  }) {
    // 关闭验证码配置，这样方便开发环境调试添加用户
    if (!this.configService.get('ENABLE_CHECK_CAPTCHA')) {
      return
    }
    const { captcha, captchaType, email } = options
    const captchaKey = this.joinCaptchaKey({ captchaType, email })
    const captchaFromRedis = await this.redisService.get(captchaKey)
    if (!captcha) {
      throw new BaseException('验证码已过期')
    }
    if (captchaFromRedis !== captcha) {
      throw new BaseException('验证码错误')
    }
  }
  async register(createUserDto: CreateUserDto) {
    const passwordStregth = calculatePasswordStrengthLevel(
      createUserDto.password,
    )
    if (passwordStregth < 2) {
      throw new BaseException('密码强度不足')
    }
    await this.checkCaptcha({
      captcha: createUserDto.captcha,
      captchaType: 'register',
      email: createUserDto.email,
    })
    try {
      const data = await this.prismaService.user.create({
        data: {
          ...omit(createUserDto, ['captcha']),
          password: await this.hashPassword(createUserDto.password),
        },
      })
      return data
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new DatabaseException('姓名或邮箱已存在')
      }

      // 如果没有认识的错误，原路返回
      throw error
    }
  }

  /**
   * 这里是检查输入用户名密码登录
   * @param loginDto
   * @returns
   */
  async validateUser(loginDto: LoginDto) {
    if (!loginDto.username || !loginDto.password) {
      throw new BaseException('用户名或密码不能为空')
    }
    const userlist = await this.userSevice.findUserByNameOrEmail(
      loginDto.username,
    )
    this.logger.debug({ data: userlist, msg: '登录查找用户', loginDto })
    // 查找不到用户时
    if (userlist.length < 1) {
      // throw new DatabaseException('该用户不存在')
      throw new DatabaseException('用户名或密码错误')
    }
    // 暂不考虑重复数据的情况
    const user = userlist[0]

    // 第三方登录的情况，如果没有修改密码，则不能手动登录
    if (!user.password) {
      throw new DatabaseException('该用户不存在')
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    )
    if (!isPasswordCorrect) {
      throw new DatabaseException('用户名或密码错误')
    }
    return omit(user, ['password'])
  }

  async addToken(user: User) {
    const payload = {
      username: user.name,
      sub: user.id,
      role: user.role,
      /* 签发时间 */
      iat: dayjs().valueOf(),
    }
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    } satisfies LoginRes
  }

  async githubLogin(gitbubAuthInfo: GithubAuthInfo) {
    if (!gitbubAuthInfo.profile.id) {
      throw new BaseException('未获取到github id')
    }
    const user = await this.userSevice.findUserByGithubId(
      gitbubAuthInfo.profile.id,
    )
    let userData: User | null
    // 用户不存在时要调用创建用户的逻辑
    if (!user) {
      let userName = gitbubAuthInfo.profile.username
      const isUsernameExists =
        await this.userSevice.checkUserNameExists(userName)
      if (isUsernameExists) {
        userName = uuidV4()
        this.logger.warn({
          msg: '用户名已存在,生成uuid替代',
          username: gitbubAuthInfo.profile.username,
          newUsername: userName,
        })
      }

      userData = await this.userSevice.createUser({
        name: userName,
        email: gitbubAuthInfo.profile.email,
        githubId: gitbubAuthInfo.profile.id,
        githubAuthInfo: JSON.stringify(gitbubAuthInfo),
        avatarUrl: gitbubAuthInfo.profile.photos[0].value,
        password: '',
        registryType: 'GITHUB',
      })
    }

    // 存在用户则更新github相关的信息
    userData = await this.userSevice.updateUser({
      where: { githubId: gitbubAuthInfo.profile.id },
      data: {
        githubAuthInfo: JSON.stringify(gitbubAuthInfo),
      },
    })
    return this.addToken(userData)
  }
  /**
   * @param googleAuthInfo
   * @returns
   */
  async googleLogin(googleAuthInfo: GoogleAuthInfo) {
    if (!googleAuthInfo.profile.id) {
      throw new BaseException('未获取到google id')
    }
    const user = await this.userSevice.user({
      googleId: googleAuthInfo.profile.id,
    })

    let userData: User | null
    // 用户不存在时要调用创建用户的逻辑
    if (!user) {
      let userName = googleAuthInfo.profile.displayName
      const isUsernameExists =
        await this.userSevice.checkUserNameExists(userName)
      if (isUsernameExists) {
        userName = uuidV4()
        this.logger.warn({
          msg: '用户名已存在,生成uuid替代',
          username: googleAuthInfo.profile.username,
          newUsername: userName,
        })
      }

      userData = await this.userSevice.createUser({
        name: userName,
        email: googleAuthInfo.profile.emails?.[0]?.value,
        githubId: googleAuthInfo.profile.id,
        githubAuthInfo: JSON.stringify(googleAuthInfo),
        avatarUrl: googleAuthInfo.profile?.photos?.[0]?.value,
        password: '',
        registryType: 'GOOGLE',
      })
    }

    // 存在用户则更新google相关的信息
    userData = await this.userSevice.updateUser({
      where: { githubId: googleAuthInfo.profile.id },
      data: {
        googleAuthInfo: JSON.stringify(googleAuthInfo),
      },
    })
    return this.addToken(userData)
  }

  async sendCaptcha(
    sendCaptchaDto: SendCaptchaDto,
    options: { captchaType: CaptchaType },
  ) {
    const { captchaType } = options
    const code = generateBase62Code(6)
    let emailHtml = `<p>您的验证码是 ${code}</p>`
    switch (captchaType) {
      case 'register':
        emailHtml = `<p>您的注册验证码是 ${code}</p>`
        break
      case 'login':
        emailHtml = `<p>您的登录验证码是 ${code}</p>`
        break
      case 'changePassword':
        emailHtml = `<p>您的修改密码验证码是 ${code}</p>`
        break
      case 'forgetPassword':
        emailHtml = `<p>您的忘记密码验证码是 ${code}</p>`
        break
    }
    try {
      await this.emailService.sendMail({
        from: {
          name: 'monorepo-demo',
          address: this.emailService.getConfig()?.auth?.user ?? '',
        },
        to: sendCaptchaDto.email,
        subject: 'monorepo-demo 注册验证码',
        html: emailHtml,
      })
      const captchaKey = this.joinCaptchaKey({
        captchaType,
        email: sendCaptchaDto.email,
      })
      await this.redisService.set(captchaKey, code, 5 * MINUTE)
    } catch (err) {
      this.logger.error({ msg: '发送验证码失败', error: err })
      throw new BaseException('发送验证码失败')
      // return false
    }

    return true
  }
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userInfo: JwtPayload,
  ) {
    const passwordStregth = calculatePasswordStrengthLevel(
      changePasswordDto.newPassword,
    )
    if (passwordStregth < 2) {
      throw new BaseException('密码强度不足')
    }
    await this.checkCaptcha({
      captcha: changePasswordDto.captcha,
      captchaType: 'register',
      email: changePasswordDto.email,
    })

    const currentUser = await this.prismaService.user.findUnique({
      where: { id: userInfo.sub },
      omit: {
        password: false,
      },
    })
    if (!currentUser) {
      throw new BaseException('用户不存在')
    }

    // 用户密码不存在的情况，可以直接设置密码
    if (!currentUser.password) {
      await this.prismaService.user.update({
        where: { id: userInfo.sub },
        data: {
          password: await this.hashPassword(changePasswordDto.newPassword),
        },
      })
      return true
    }
    // 密码
    const isPasswordCorrect = await bcrypt.compare(
      changePasswordDto.oldPassword,
      currentUser.password,
    )
    if (!isPasswordCorrect) {
      throw new BaseException('旧密码错误')
    }
    await this.prismaService.user.update({
      where: { id: userInfo.sub },
      data: {
        password: await this.hashPassword(changePasswordDto.newPassword),
      },
    })
    return true
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    // throw new Error('Method not implemented.')
    await this.checkCaptcha({
      captcha: forgetPasswordDto.captcha,
      captchaType: 'forgetPassword',
      email: forgetPasswordDto.email,
    })
    const currentUser = await this.prismaService.user.findUnique({
      where: { email: forgetPasswordDto.email },
      omit: {
        password: false,
      },
    })
    if (!currentUser) {
      throw new BaseException('用户不存在')
    }

    await this.prismaService.user.update({
      where: { id: forgetPasswordDto.email },
      data: {
        password: await this.hashPassword(forgetPasswordDto.newPassword),
      },
    })
    return true
  }

  async onModuleInit() {
    await this.initTables()
  }
  async initTables() {
    await this.initUserTable()
    await this.initCasbinTable()
  }

  async initCasbinTable() {
    const casbinRuleCount = await this.prismaService.casbinRule.count()
    // 初始化一条规则针对管理员
    if (casbinRuleCount === 0) {
      await this.prismaService.casbinRule.createMany({
        data: {
          ptype: 'p',
          v0: 'ADMIN',
          v1: '/*',
          v2: '(GET|POST|PUT|DELETE|PATCH)',
        },
      })
    }
  }
  async initUserTable() {
    const userCount = await this.prismaService.user.count()
    if (userCount === 0) {
      const password = await this.hashPassword(
        this.configService.get('DEFAUT_ADMIN_PASSWORD') ?? '123456',
      )
      await this.prismaService.user.create({
        data: {
          name: 'admin',
          password,
          role: 'ADMIN',
          registryType: 'NORMAL',
          email: 'admin@163.com',
        },
      })
    }
  }
}
