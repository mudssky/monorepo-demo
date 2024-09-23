import { PartialType } from '@nestjs/mapped-types';
import { CreateNestWebsocketDto } from './create-nest-websocket.dto';

export class UpdateNestWebsocketDto extends PartialType(CreateNestWebsocketDto) {
  id: number;
}
