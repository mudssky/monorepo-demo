import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { CreateUserDto } from '../user/dto/user.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { DatabaseException } from '@/common/exceptions/database'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
}
