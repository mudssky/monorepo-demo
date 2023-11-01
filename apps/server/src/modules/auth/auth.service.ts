import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { CreateUserDto } from '../user/dto/user.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { DatabaseException } from '@/common/exceptions/database'
import { LoginDto } from './dto/auth.dto'
import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { omit } from 'lodash'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  //  private readonly logger = new Logger()
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: GlobalLoggerService,
    private readonly userSevice: UserService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
      })
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
    this.logger.debug({ data: userlist, msg: '登录查找用户' })
    // 查找不到用户时
    if (userlist.length < 1) {
      throw new DatabaseException('该用户不存在', HttpStatus.UNAUTHORIZED)
    }
    // 暂不考虑重复数据的情况
    const user = userlist[0]
    if (user.password !== loginDto.password) {
      throw new DatabaseException('用户名或密码错误', HttpStatus.UNAUTHORIZED)
    }
    return omit(user, ['password'])
  }
}
