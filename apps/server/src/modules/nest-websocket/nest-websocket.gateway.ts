import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Observable } from 'rxjs'
import { CreateNestWebsocketDto } from './dto/create-nest-websocket.dto'
import { UpdateNestWebsocketDto } from './dto/update-nest-websocket.dto'
import { NestWebsocketService } from './nest-websocket.service'

@WebSocketGateway(33155, {
  namespace: 'nest-websocket',
  // cors: {
  //   origin: '*',
  // },
})
export class NestWebsocketGateway {
  constructor(private readonly nestWebsocketService: NestWebsocketService) {}

  @SubscribeMessage('createNestWebsocket')
  create(@MessageBody() createNestWebsocketDto: CreateNestWebsocketDto) {
    console.log('createNestWebsocket', createNestWebsocketDto)
    return this.nestWebsocketService.create(createNestWebsocketDto)
  }

  @SubscribeMessage('findAllNestWebsocket')
  findAll() {
    console.log('findAllNestWebsocket')
    return this.nestWebsocketService.findAll()
  }

  @SubscribeMessage('findOneNestWebsocket')
  findOne(@MessageBody() id: number) {
    return this.nestWebsocketService.findOne(id)
  }

  @SubscribeMessage('updateNestWebsocket')
  update(@MessageBody() updateNestWebsocketDto: UpdateNestWebsocketDto) {
    console.log('updateNestWebsocket', updateNestWebsocketDto)
    return this.nestWebsocketService.update(
      updateNestWebsocketDto.id,
      updateNestWebsocketDto,
    )
  }

  @SubscribeMessage('removeNestWebsocket')
  remove(@MessageBody() id: number) {
    return this.nestWebsocketService.remove(id)
  }
  @SubscribeMessage('testChangeEvent')
  changeEvent(@MessageBody() data: any) {
    console.log('testChangeEvent', data)

    return {
      event: 'changeEvent',
      data: {
        message: '测试返回不同的event',
      },
    }
  }

  @SubscribeMessage('sendBackLater')
  sendBackLater(@MessageBody() data: any) {
    console.log('sendBackLater', data)
    const event = 'sendBackLater'
    return new Observable((observer) => {
      observer.next({ event, data: { msg: '111' } })

      setTimeout(() => {
        observer.next({ event, data: { msg: '222' } })
      }, 2000)

      setTimeout(() => {
        observer.next({ event, data: { msg: '333' } })
      }, 5000)
    })

    // const event = 'sendBackLater'
    // const response = [1, 2, 3]
    // return from(response).pipe(map((data) => ({ event, data })))
  }
}
