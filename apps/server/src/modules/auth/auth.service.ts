import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { CreateUserDto } from '../user/dto/user.dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { DatabaseException } from '@/common/exceptions/database'
import { LoginDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  //  private readonly logger = new Logger()
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
  async login(loginDto: LoginDto) {
    const res = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            email: { equals: loginDto.username },
          },
          {
            name: { equals: loginDto.username },
          },
        ],
      },
    })
    if (res.length > 0) {
    }
    // {
    //   where: {
    //     OR: [
    //       {
    //         email: { equals: loginDto.username },
    //       },
    //       {
    //         name: { equals: loginDto.username },
    //       },
    //     ],
    //   },
    // }
    console.log({ res })
  }
}
