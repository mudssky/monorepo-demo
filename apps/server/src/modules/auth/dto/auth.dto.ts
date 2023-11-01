import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'

export class LoginDto implements Pick<User, 'password'> {
  @ApiProperty()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: '可以传入用户名或邮箱',
  })
  @IsNotEmpty()
  username: string
}
