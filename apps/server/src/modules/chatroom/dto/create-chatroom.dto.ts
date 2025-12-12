import { ApiProperty } from '@nestjs/swagger'
import { $Enums, Chatroom } from '@prisma/client'
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

export class ChatRoomListResDto implements Chatroom {
  id: string
  name: string
  type: $Enums.ChatRoomType
  createdAt: Date
  updatedAt: Date
  @ApiProperty()
  userIds: string[]
  @ApiProperty()
  userCount: number
}

export class ChatroomQueryDto {
  @ApiProperty({
    description: '房间名',
  })
  roomName: string
}
