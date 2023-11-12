import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { PrismaService } from '@/modules/prisma/prisma.service'
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

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
export class SystemMonitorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: GlobalLoggerService,
  ) {
    this.logger.setContext({
      label: SystemMonitorGateway.name,
    })
  }

  @WebSocketServer()
  server: Server

  /**
   * websocket 网关初始化钩子
   * @param server
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    this.logger.info({ info: 'websocket gateway init' })
  }

  /**
   * websocket 连接钩子
   * @param client
   * @param args
   */
  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.request.headers)

    this.logger.debug({
      info: 'connected',
      args,
      id: client.id,
    })
  }

  /**
   * websocket 断连钩子
   * @param client
   */
  handleDisconnect(client: Socket) {
    // throw new Error('Method not implemented.')
    this.logger.debug({
      info: 'disconnected',
      id: client.id,
    })
  }

  // 事件名，发送消息时要指定
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    const sendMsg = 'Hello world!'
    // client.emit('message', sendMsg)
    this.logger.debug({
      eventName: 'message',
      receive: body,
      send: sendMsg,
    })

    throw new WsException('hhh kkk')

    // 如果发送方没有开启ack，也可以监听事件，那样就可以收到this.server.emit发送的东西
    // 适用于服务端主动推送的情况,而且是广播
    // this.server.emit('message', sendMsg)

    // 返回值会发送给发送方，但是发送方需要开启ack才能收到，是对单发送
    // 前端主动获取数据的情况，用这个方式比较直接
    return sendMsg
  }

  /**
   * echo 服务器，对传入的内容原样返回
   * @param body
   */
  @SubscribeMessage('echo')
  handleEcho(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    const event = 'echo'
    const sendMsg = body
    // client.emit('message', sendMsg)
    this.logger.debug({
      eventName: 'message',
      receive: body,
      send: sendMsg,
    })
    // 广播
    // this.server.emit(event, sendMsg)
    socket.emit(event, sendMsg)
    // 发送并等待响应
    // socket.emitWithAck()
  }
}

// websocket的服务端有以下3种发送
// 1,回复客户端ack，是对单的 ， 也就是函数返回值
// 2. 广播推送          this.server.emit('message', sendMsg)
// 3. 不带ack的主动推送，对单   socket.emit(event, sendMsg)
// 4.带ack的主动推送，对单，需要等待客户端回复 socket.emitWithAck()
