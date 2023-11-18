import { ApiProperty } from '@nestjs/swagger'

import { $Enums } from '@prisma/client'
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

export class LoginResDto implements LoginRes {
  @ApiProperty({
    description: 'jwt token',
  })
  access_token: string
  id: number
  email: string
  name: string
  password: string
  @ApiProperty({ enum: $Enums.Role })
  role: $Enums.Role
  @ApiProperty({ enum: $Enums.UserStatus })
  status: $Enums.UserStatus
  createdAt: Date
}
