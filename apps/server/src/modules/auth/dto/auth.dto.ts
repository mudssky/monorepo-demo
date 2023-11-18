import { ApiProperty } from '@nestjs/swagger'

import { $Enums, User } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'
import { LoginReq, LoginRes } from '../types'

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

export class UserDto implements User {
  @ApiProperty()
  id: number
  @ApiProperty()
  email: string
  @ApiProperty()
  name: string
  @ApiProperty()
  password: string
  @ApiProperty()
  role: $Enums.Role
  @ApiProperty()
  status: $Enums.UserStatus
  @ApiProperty()
  createdAt: Date
}
export class LoginResDto implements LoginRes {
  @ApiProperty({
    description: 'jwt token',
  })
  access_token: string
  id: number
  email: string
  name: string
  password: string
  role: $Enums.Role
  status: $Enums.UserStatus
  createdAt: Date
}
