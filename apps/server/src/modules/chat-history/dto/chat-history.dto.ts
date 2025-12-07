import { ChatHistory } from '#prisma'

export class ChatHistoryDto implements Omit<
  ChatHistory,
  'createTime' | 'updateTime' | 'id'
> {
  content: string
  type: number
  chatroomId: string
  senderId: string
}
