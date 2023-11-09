import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'

export type LoginReq = Pick<User, 'password'>
export class LoginDto implements LoginReq {
  @ApiProperty()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: '可以传入用户名或邮箱',
  })
  @IsNotEmpty()
  username: string
}
