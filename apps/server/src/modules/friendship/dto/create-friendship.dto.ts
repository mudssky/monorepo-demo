import { ApiProperty } from '@nestjs/swagger'
import { FriendRequest } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'

export class CreateFriendshipDto
  implements Pick<FriendRequest, 'toUserId' | 'reason'>
{
  @ApiProperty({
    description: '添加的好友id',
  })
  @IsNotEmpty()
  toUserId: string
  @ApiProperty({
    description: '申请理由',
  })
  @IsNotEmpty()
  reason: string
}
