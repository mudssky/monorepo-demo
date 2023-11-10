import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })

// 默认端口和nest启动端口一致，可以通过 127.0.0.1:33101连接，注意要用socket.io协议
// 因为nest默认使用socket.io
// 也可以安装@nestjs/platform-ws,之后使用适配器 app.useWebSocketAdapter(new WsAdapter(app))
// ，这样就可以 切换到ws
@WebSocketGateway()
@ApiTags('系统监控')
export class SystemMonitorGateway {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: GlobalLoggerService,
  ) {}

  @WebSocketServer()
  server: Server
  // 事件名，发送消息时要指定
  @SubscribeMessage('message')
  @ApiOperation({ summary: 'hello world' })
  handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const sendMsg = 'Hello world!'
    // client.emit('message', sendMsg)
    this.logger.debug({
      eventName: 'message',
      receive: body,
      send: sendMsg,
    })
    this.server.emit('message', sendMsg)
  }
}
