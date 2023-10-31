import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { CreateUserDto } from '../user/dto/user.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    })
  }
}
