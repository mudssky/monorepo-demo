import { RegisterReq } from '@/modules/auth/types'
import { ApiProperty } from '@nestjs/swagger'
import { $Enums, User } from '@prisma/client'
import { IsEmail, IsNotEmpty } from 'class-validator'

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

export class UserDto implements Omit<User, 'password'> {
  @ApiProperty()
  id: number
  @ApiProperty()
  email: string
  @ApiProperty()
  name: string
  @ApiProperty({ enum: $Enums.Role })
  role: $Enums.Role
  @ApiProperty({ enum: $Enums.UserStatus })
  status: $Enums.UserStatus
  @ApiProperty()
  createdAt: Date
  @ApiProperty()
  avatarUrl: string | null
}
