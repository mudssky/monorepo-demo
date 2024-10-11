import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ChatHistoryDto } from './dto/chat-history.dto'

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService

  async list(chatroomId: string) {
    const chatHistorys = await this.prismaService.chatHistory.findMany({
      where: {
        chatroomId,
      },
    })
    const res: any[] = []

    for (const chatHistory of chatHistorys) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: chatHistory.senderId,
        },
      })

      res.push({
        ...chatHistory,
        sender: user,
      })
    }
    return res
  }

  async add(chatroomId: string, history: ChatHistoryDto) {
    return this.prismaService.chatHistory.create({
      data: history,
    })
  }
}
