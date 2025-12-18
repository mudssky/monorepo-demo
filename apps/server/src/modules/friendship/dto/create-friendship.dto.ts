import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { FriendRequest } from '#prisma/client'

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

export class FriendshipQueryDto {
  @ApiProperty({
    description: '好友昵称',
  })
  nickName: string
}

/**
 * 添加好友时，使用用户id会不方便，这里使用用户名
 */
export class AddFriendshipDto extends PickType(CreateFriendshipDto, [
  'reason',
]) {
  @ApiProperty({
    description: '添加的好友用户名',
  })
  username: string
}
