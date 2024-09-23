import { Module } from '@nestjs/common'
import { GroupChatroomDemoGateway } from './group-chatroom-demo.gateway'

@Module({
  providers: [GroupChatroomDemoGateway],
})
export class GroupChatroomDemoModule {}
