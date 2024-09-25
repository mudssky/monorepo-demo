import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateSingleChatroomDto {
  @ApiProperty()
  @IsNotEmpty()
  friendId: string
}

export class CreateGroupChatroomDto {
  @ApiProperty()
  @IsNotEmpty()
  roomName: string
}
