import { Inject } from '@nestjs/common'
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'
import { ChatHistoryService } from '../chat-history/chat-history.service'
import { UserService } from '../user/user.service'

interface JoinRoomPayload {
  chatroomId: string
  userId: string
}

interface SendMessagePayload {
  sendUserId: string
  chatroomId: string
  message: Message
}
interface Message {
  type: MessageTypeEnum
  content: string
}

// type Reply  = {
//     type: 'sendMessage'
//     userId: number
//     message: Message
// } | {
//     type: 'joinRoom'
//     userId: number
// }

enum MessageTypeEnum {
  TEXT = 10,
  IMAGE = 20,
  FILE = 30,
}
@WebSocketGateway({
  namespace: 'chatroom',
})
export class ChatroomGateway {
  @WebSocketServer() serverSocket: Server

  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService

  @Inject(UserService)
  private userService: UserService

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomPayload): void {
    const roomName = payload.chatroomId.toString()
    client.join(roomName)
    this.serverSocket.to(roomName).emit('message', {
      type: 'joinRoom',
      userId: payload.userId,
    })
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: SendMessagePayload) {
    const roomName = payload.chatroomId.toString()
    const history = await this.chatHistoryService.add(payload.chatroomId, {
      content: payload.message.content,
      type: payload.message.type,
      chatroomId: payload.chatroomId,
      senderId: payload.sendUserId,
    })
    const sender = await this.userService.getUserInfoById(payload.sendUserId)
    this.serverSocket.to(roomName).emit('message', {
      type: 'sendMessage',
      userId: payload.sendUserId,
      message: { ...history, sender },
    })
  }
}
