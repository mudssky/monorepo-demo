import { ChatHistory } from '@prisma/client'

export class ChatHistoryDto
  implements Omit<ChatHistory, 'createTime' | 'updateTime' | 'id'>
{
  content: string
  type: number
  chatroomId: string
  senderId: string
}
