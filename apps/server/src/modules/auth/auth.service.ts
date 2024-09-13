import { DatabaseException } from '@/common/exceptions/database'
import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { omit } from '@mudssky/jsutils'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../user/dto/user.dto'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/auth.dto'
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

  async validateUser(loginDto: LoginDto) {
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

}
