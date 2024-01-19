import { PrismaService } from '@/modules/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { JwtUser } from '../auth/types'
import { GlobalLoggerService } from '../logger/logger.service'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: GlobalLoggerService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async users(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    // await new Promise((resolve) => setTimeout(resolve, 3000))
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    const res = await this.prisma.user.update({
      data,
      where,
    })
    console.log({ res })
    return res
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  }
  /**
   * 登陆时，可以输入用户名或邮箱作为登录的用户名
   * @param username
   */
  async findUserByNameOrEmail(username: string) {
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

  async getUserInfo(user: JwtUser) {
    const data = await this.prisma.user.findUnique({
      where: {
        id: user.userId,
      },
    })
    return this.prisma.exclude(data, ['password'])
  }
}
