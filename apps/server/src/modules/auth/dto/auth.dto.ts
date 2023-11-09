import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty } from 'class-validator'
import { LoginReq } from '../types'

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
