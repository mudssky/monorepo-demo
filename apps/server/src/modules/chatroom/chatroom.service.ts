import { BaseException } from '@/common/exceptions'
import { generateBase62Code } from '@mudssky/jsutils'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  ChatRoomListResDto,
  ChatroomQueryDto,
  CreateGroupChatroomDto,
  CreateSingleChatroomDto,
} from './dto/create-chatroom.dto'

@Injectable()
export class ChatroomService {
  constructor(private readonly prismaService: PrismaService) {}

  async quitRoom(params: { chatroomId: string; userId: string }) {
    const { chatroomId, userId } = params
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    })
    if (!chatroom) {
      throw new BaseException('聊天室不存在')
    }
    if (chatroom.type === 'SINGLE') {
      throw new BaseException('一对一聊天室不能退出')
    }
    await this.prismaService.userChatroom.deleteMany({
      where: {
        userId,
        chatroomId,
      },
    })
    return '退出成功'
  }

  async joinRoom(params: { chatroomId: string; userId: string }) {
    const { chatroomId, userId } = params
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    })
    if (!chatroom) {
      throw new BaseException('聊天室不存在')
    }
    if (chatroom.type === 'SINGLE') {
      throw new BaseException('一对一聊天室不能加人')
    }

    await this,
      this.prismaService.userChatroom.create({
        data: {
          userId,
          chatroomId,
        },
      })
    return '加入成功'
  }

  async getChatroomInfo(chatroomId: string) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    })
    return { ...chatroom, users: await this.getRoomMemberList(chatroomId) }
  }
  async getRoomMemberList(chatroomId: string) {
    const userIds = await this.prismaService.userChatroom.findMany({
      where: {
        chatroomId,
      },
      select: {
        userId: true,
      },
    })
    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: userIds.map((item) => item.userId),
        },
      },
      select: {
        id: true,
        name: true,
        nickName: true,
        avatarUrl: true,
        createdAt: true,
        email: true,
      },
    })
    return users
  }
  async getRoomList(userId: string, chatroomQueryDto: ChatroomQueryDto) {
    // 查找用户相关的所有房间id
    const chatroomIds = await this.prismaService.userChatroom.findMany({
      where: {
        userId,
      },
      select: {
        chatroomId: true,
      },
    })

    // 查找房间id相关的房间信息
    const chatrooms = await this.prismaService.chatroom.findMany({
      where: {
        id: {
          in: chatroomIds.map((item) => item.chatroomId),
        },
        name: {
          contains: chatroomQueryDto?.roomName ?? '',
        },
      },
      // omit: {
      //   type: true,
      // },
    })
    // 查找房间相关的用户信息
    const res: ChatRoomListResDto[] = []

    for (let i = 0; i < chatrooms.length; i++) {
      const chatroom = chatrooms[i]
      const userIds = await this.prismaService.userChatroom.findMany({
        where: {
          chatroomId: chatroom.id,
        },
        select: {
          userId: true,
        },
      })
      res.push({
        ...chatroom,
        userIds: userIds.map((item) => item.userId),
        userCount: userIds.length,
      })
    }
    return res
    // const chatrooms = await this.prismaService.chatroom.findMany({
    //   where: {
    //     id: {
    //       in: chatroomIds.map((item) => item.chatroomId),
    //     },
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     type: true,
    //     createdAt: true,
    //   },
    // })
    // return chatrooms
  }
  async creteGroupChatroom(
    createGroupChatroomDto: CreateGroupChatroomDto,
    userId: string,
  ) {
    const { id } = await this.prismaService.chatroom.create({
      data: {
        name: createGroupChatroomDto.roomName,
        type: 'GROUP',
      },
      select: {
        id: true,
      },
    })
    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId: id,
      },
    })
    return '创建成功'
  }

  async createSingleChatroom(
    createSingleChatroomDto: CreateSingleChatroomDto,
    userId: string,
  ) {
    const { id } = await this.prismaService.chatroom.create({
      data: {
        name: 'chatromm_' + generateBase62Code(8),
        type: 'SINGLE',
      },
      select: {
        id: true,
      },
    })

    await this.prismaService.userChatroom.createMany({
      data: [
        {
          userId,
          chatroomId: id,
        },
        {
          userId: createSingleChatroomDto.friendId,
          chatroomId: id,
        },
      ],
    })
    return '创建成功'
  }
}
