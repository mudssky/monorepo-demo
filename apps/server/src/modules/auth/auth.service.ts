import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { CreateUserDto } from '../user/dto/user.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { DatabaseException } from '@/common/exceptions/database'
import { LoginDto } from './dto/auth.dto'
import { GlobalLoggerService } from '@/modules/logger/logger.service'

@Injectable()
export class AuthService {
  //  private readonly logger = new Logger()
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: GlobalLoggerService,
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
  /**
   * 登陆时，可以输入用户名或邮箱作为登录的用户名
   * @param username
   */
  private async findUserByNameOrEmail(username: string) {
    return await this.prisma.user.findMany({
      where: {
        OR: [
          {
            email: { equals: username },
          },
          {
            name: { equals: username },
          },
        ],
      },
    })
  }
  async login(loginDto: LoginDto) {
    const userlist = await this.findUserByNameOrEmail(loginDto.username)
    this.logger.debug({ data: userlist, msg: '登录查找用户' })
    // 查找不到用户时
    if (userlist.length < 1) {
      throw new DatabaseException('该用户不存在')
    }
  }
}
