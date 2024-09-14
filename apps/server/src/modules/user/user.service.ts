import { BaseException } from '@/common/exceptions'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { JwtUser } from '../auth/types'
import { SharedService } from '../global/shared.service'
import { GlobalLoggerService } from '../logger/logger.service'
import { UserDtoType } from './types'

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private readonly logger: GlobalLoggerService,
    private readonly sharedService: SharedService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
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
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data,
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }) {
    const { where, data } = params
    const res = await this.prismaService.user.update({
      data,
      where,
    })
    return {
      ...res,
      avatarFullUrl: this.sharedService.getFullImageUrl(res.avatarUrl ?? ''),
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    })
  }
  /**
   * 登录时，可以输入用户名或邮箱作为登录的用户名
   * @param username
   */
  async findUserByNameOrEmail(username: string) {
    return await this.prismaService.user.findMany({
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
  async checkUserNameExists(name: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        name,
      },
    })
    if (user) {
      return true
    }
    return false
  }

  async findUserByGithubId(
    githubId: string,
  ): Promise<Partial<UserDtoType | null>> {
    const data = await this.prismaService.user.findUnique({
      where: {
        githubId: githubId,
      },
    })
    if (!data) {
      return null
    }
    return data
  }
  async getUserInfo(user: JwtUser): Promise<Partial<UserDtoType>> {
    const data = await this.prismaService.user.findUnique({
      where: {
        id: user.userId,
      },
      omit: {
        githubAuthInfo: true,
      },
    })
    if (!data) {
      throw new BaseException('用户不存在')
    }
    return {
      ...data,
      avatarFullUrl: this.sharedService.getFullImageUrl(data?.avatarUrl ?? ''),
    }
  }
}
