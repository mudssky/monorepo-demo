import { Module } from '@nestjs/common'
import { NestWebsocketService } from './nest-websocket.service'
import { NestWebsocketGateway } from './nest-websocket.gateway'

@Module({
  providers: [NestWebsocketGateway, NestWebsocketService],
})
export class NestWebsocketModule {}
