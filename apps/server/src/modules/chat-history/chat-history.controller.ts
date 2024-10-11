import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChatHistoryService } from './chat-history.service'

@ApiTags('聊天历史记录')
@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Get('list')
  async list(@Query('chatroomId') chatroomId: string) {
    return this.chatHistoryService.list(chatroomId)
  }
}
