import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { pick } from 'lodash-es'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  namespace: 'group-chatroom-demo',
})
export class GroupChatroomDemoGateway {
  @WebSocketServer() serverSocket: Server

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, room: string) {
    console.log({ room })
    client.join(room)
    this.serverSocket
      .to(room)
      .emit('message', {
        message: `User ${client.id} joined the room`,
        nickName: 'system',
      })
  }

  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, payload: any): void {
    console.log({ payload })
    this.serverSocket
      .to(payload.roomName)
      .emit('message', pick(payload, ['message', 'nickName']))
  }
}
