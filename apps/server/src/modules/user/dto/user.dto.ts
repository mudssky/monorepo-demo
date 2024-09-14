import { RegisterReq } from '@/modules/auth/types'
import { ApiProperty } from '@nestjs/swagger'
import { $Enums } from '@prisma/client'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { UpdateUserDtoType, UserDtoType } from '../types'

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

/**
 * 用户信息对象,登录用户可查看的部分
 */
export class UserDto implements UserDtoType {
  googleId: string | null
  googleAuthInfo: string | null
  registryType: $Enums.RegistryType
  githubId: string | null
  githubAuthInfo: string | null
  @ApiProperty()
  id: number
  @ApiProperty()
  email: string
  @ApiProperty()
  name: string
  @ApiProperty({ enum: $Enums.Role })
  role: $Enums.Role
  @ApiProperty()
  createdAt: Date
  @ApiProperty()
  avatarUrl: string | null
  @ApiProperty({
    description: '头像完整地址',
  })
  avatarFullUrl: string | null
}

export class UpdateUserDto implements UpdateUserDtoType {
  @ApiProperty()
  name: string
  @ApiProperty()
  avatarUrl: string
  @ApiProperty()
  @IsNotEmpty()
  id: number
  @ApiProperty()
  avatarFullUrl: string | null
}
