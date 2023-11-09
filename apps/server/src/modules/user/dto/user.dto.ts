import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { User as UserModel } from '@prisma/client'

export type RegisterReq = Pick<UserModel, 'email' | 'name' | 'password'>
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
