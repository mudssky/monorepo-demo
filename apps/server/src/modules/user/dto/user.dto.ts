import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

import { RegisterReq } from '@/modules/auth/types'

/**
 * 创建用户需要的参数
 */
export class CreateUserDto implements RegisterReq {
  @ApiProperty()
  @IsNotEmpty()
  password: string
  @ApiProperty()
  @IsNotEmpty()
  name: string
  @ApiProperty()
  @IsEmail()
  email: string
}
