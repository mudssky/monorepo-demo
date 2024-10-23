import { Module } from '@nestjs/common'
import { ChatHistoryModule } from '../chat-history/chat-history.module'
import { UserModule } from '../user/user.module'
import { ChatroomController } from './chatroom.controller'
import { ChatroomGateway } from './chatroom.gateway'
import { ChatroomService } from './chatroom.service'

@Module({
  imports: [ChatHistoryModule, UserModule],
  controllers: [ChatroomController],
  providers: [ChatroomService, ChatroomGateway],
})
export class ChatroomModule {}
