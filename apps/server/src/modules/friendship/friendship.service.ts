import { Injectable } from '@nestjs/common'
import { JwtPayload } from '../auth/types'
import { PrismaService } from '../prisma/prisma.service'
import {
  CreateFriendshipDto,
  FriendshipQueryDto,
} from './dto/create-friendship.dto'
import { FriendRequestStatus } from './friendship.enum'
interface FriendRequestParam {
  friendId: string
  userId: string
}
@Injectable()
export class FriendshipService {
  constructor(private readonly prismaService: PrismaService) {}

  async sendFriendRequest(
    createFriendshipDto: CreateFriendshipDto,
    userInfo: JwtPayload,
  ) {
    return await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userInfo.sub,
        toUserId: createFriendshipDto.toUserId,
        reason: createFriendshipDto.reason,
        status: FriendRequestStatus.Pending,
      },
    })
  }
  async getFriendRequestList(userId: string) {
    // throw new Error('Method not implemented.')
    return this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
      },
    })
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
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: FriendRequestStatus.Pending,
      },
      data: {
        status: FriendRequestStatus.Accepted,
      },
    })

    // 检查好友关系表中是否村啊在这条
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
