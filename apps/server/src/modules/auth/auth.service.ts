import { BaseException } from '@/common/exceptions'
import { DatabaseException } from '@/common/exceptions/database'
import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { omit } from '@mudssky/jsutils'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'
import { CreateUserDto } from '../user/dto/user.dto'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/auth.dto'
import { GithubAuthInfo } from './strategy/github.strategy'
import { GoogleAuthInfo } from './strategy/google.strategy'
import { LoginRes } from './types'

@Injectable()
export class AuthService {
  //  private readonly logger = new Logger()
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: GlobalLoggerService,
    private readonly userSevice: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.logger.setContext({ label: AuthService.name })
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)
    return hash
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const data = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await this.hashPassword(createUserDto.password),
        },
      })
      return this.prismaService.exclude(data, ['password'])
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

  async login(user: User) {
    const payload = { username: user.name, sub: user.id }
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
    return this.login(userData)
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
    return this.login(userData)
  }
}
