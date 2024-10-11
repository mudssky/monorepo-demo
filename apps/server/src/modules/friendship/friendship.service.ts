import { BaseException } from '@/common/exceptions'
import { Injectable, Logger } from '@nestjs/common'
import { JwtPayload } from '../auth/types'
import { PrismaService } from '../prisma/prisma.service'
import {
  AddFriendshipDto,
  FriendshipQueryDto,
} from './dto/create-friendship.dto'
import { FriendRequestStatus } from './friendship.enum'
interface FriendRequestParam {
  friendId: string
  userId: string
}
@Injectable()
export class FriendshipService {
  private readonly logger = new Logger(FriendshipService.name)
  constructor(private readonly prismaService: PrismaService) {}

  async sendFriendRequest(
    createFriendshipDto: AddFriendshipDto,
    userInfo: JwtPayload,
  ) {
    const friend = await this.prismaService.user.findUnique({
      where: {
        name: createFriendshipDto.username,
      },
    })

    if (!friend) {
      throw new BaseException('用户不存在')
    }
    if (friend.id === userInfo.sub) {
      throw new BaseException('不能添加自己为好友')
    }

    // 检查是否已经添加好友
    const found = await this.prismaService.friendship.findMany({
      where: {
        userId: userInfo.sub,
        friendId: friend.id,
      },
    })
    if (found.length) {
      throw new BaseException('已经是好友了')
    }
    return await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userInfo.sub,
        toUserId: friend.id,
        reason: createFriendshipDto.reason,
        status: FriendRequestStatus.Pending,
      },
    })
  }
  async getFriendRequestList(userId: string) {
    // 我发送的好友请求
    const fromMeRequests = await this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
      },
    })
    // 我收到的好友请求
    const toMeRequests = await this.prismaService.friendRequest.findMany({
      where: {
        toUserId: userId,
      },
    })

    const res: any = {
      toMe: [],
      fromMe: [],
    }

    // 遍历好友请求获取相关得到用户信息
    for (let i = 0; i < fromMeRequests.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: fromMeRequests[i].toUserId,
        },
      })
      res.fromMe.push({
        ...fromMeRequests[i],
        toUser: user,
      })
    }

    for (let i = 0; i < toMeRequests.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: toMeRequests[i].fromUserId,
        },
      })
      res.toMe.push({
        ...toMeRequests[i],
        fromUser: user,
      })
    }
    return res
  }
  async reject({ friendId, userId }: FriendRequestParam) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: FriendRequestStatus.Pending,
      },
      data: {
        status: FriendRequestStatus.Declined,
      },
    })
    return '已拒绝'
  }
  async agree({ friendId, userId }: FriendRequestParam) {
    const updateRes = await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: FriendRequestStatus.Pending,
      },
      data: {
        status: FriendRequestStatus.Accepted,
      },
    })
    this.logger.debug(updateRes)
    if (updateRes.count === 0) {
      throw new BaseException('该好友请求已处理过')
    }
    // 检查好友关系表中是否存在这条
    const res = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId,
      },
    })

    if (!res.length) {
      await this.prismaService.friendship.create({
        data: {
          userId,
          friendId,
        },
      })
    }
    return '添加成功'
  }

  async getFriendship(
    userInfo: JwtPayload,
    friendshipQueryDto: FriendshipQueryDto,
  ) {
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
        nickName: {
          contains: friendshipQueryDto.nickName,
        },
      },
      select: {
        id: true,
        name: true,
        nickName: true,
        email: true,
        avatarUrl: true,
      },
    })

    return friendsList
  }

  async remove(params: FriendRequestParam) {
    const { friendId, userId } = params
    await this.prismaService.friendship.deleteMany({
      where: {
        userId,
        friendId,
      },
    })

    return '删除成功'
  }
}
