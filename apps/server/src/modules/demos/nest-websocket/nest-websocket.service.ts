/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'
import { CreateNestWebsocketDto } from './dto/create-nest-websocket.dto'
import { UpdateNestWebsocketDto } from './dto/update-nest-websocket.dto'

@Injectable()
export class NestWebsocketService {
  create(createNestWebsocketDto: CreateNestWebsocketDto) {
    return 'This action adds a new nestWebsocket'
  }

  findAll() {
    return `This action returns all nestWebsocket`
  }

  findOne(id: number) {
    return `This action returns a #${id} nestWebsocket`
  }

  update(id: number, updateNestWebsocketDto: UpdateNestWebsocketDto) {
    return `This action updates a #${id} nestWebsocket`
  }

  remove(id: number) {
    return `This action removes a #${id} nestWebsocket`
  }
}
