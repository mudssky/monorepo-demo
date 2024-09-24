import { PaginationDto, PaginationVo, parsePaginationDto } from '@/common/dto'
import { BaseException } from '@/common/exceptions'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { Injectable, Logger } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { JwtPayload } from '../auth/types'
import { SharedService } from '../global/shared.service'
import { UserDtoType } from './types'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(
    private prismaService: PrismaService,
    private readonly sharedService: SharedService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async users(paginationDto: PaginationDto) {
    const params = parsePaginationDto(paginationDto)
    const data = await this.prismaService.user.findMany({
      ...params,
    })
    const totalCount = await this.prismaService.user.count()
    const vo = new PaginationVo<(typeof data)[number]>()
    vo.results = data
    vo.totalCount = totalCount
    vo.pageNo = paginationDto.pageNo
    vo.pageSize = paginationDto.pageSize
    return vo
  }

  async getFriendship(userInfo: JwtPayload) {
    // 查询朋友关系表，获取所有和当前用户相关的关系列表
    const friends = await this.prismaService.friendship.findMany({
      where: {
        OR: [
          {
            userId: userInfo.sub,
          },
          {
            friendId: userInfo.sub,
          },
        ],
      },
    })
    const idSet = new Set<string>()
    // 无论对方加你还是你加对方，都属于两个人的好友列表
    for (let i = 0; i < friends.length; i++) {
      idSet.add(friends[i].userId)
      idSet.add(friends[i].friendId)
    }
    // 过滤掉用户自身id
    idSet.delete(userInfo.sub)
    const friendIds = Array.from(idSet)
    const friendsList = await this.prismaService.user.findMany({
      where: {
        id: {
          in: friendIds,
        },
      },
      select: {
        id: true,
        name: true,
        nickName: true,
        email: true,
      },
    })

    return friendsList
  }
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prismaService.user.create({
      data,
    })

    return user
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
  async findUserByNameOrEmail(
    username: string,
    // options?: {
    //   omitPassword?: boolean
    // },
  ) {
    // const { omitPassword = true } = options || {}
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
      omit: {
        password: false,
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
  async getUserInfoById(id: string): Promise<Partial<UserDtoType>> {
    const data = await this.prismaService.user.findUnique({
      where: {
        id,
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
