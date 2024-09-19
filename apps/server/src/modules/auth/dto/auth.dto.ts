import { ApiProperty, OmitType } from '@nestjs/swagger'

import { $Enums } from '@prisma/client'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'
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
export class GithubCallbackDto {
  code: string
}
export class LoginResDto implements LoginRes {
  googleId: string | null
  googleAuthInfo: string | null
  registryType: $Enums.RegistryType
  githubId: string | null
  githubAuthInfo: string | null
  avatarFullUrl: string | null
  avatarUrl: string | null
  @ApiProperty({
    description: 'jwt token',
  })
  access_token: string
  id: number
  email: string
  name: string
  @ApiProperty({ enum: $Enums.Role })
  role: $Enums.Role
  @ApiProperty({ enum: $Enums.UserStatus })
  status: $Enums.UserStatus
  createdAt: Date
}

/**
 * 注册返回值
 */

export class RegisterResDto extends OmitType(LoginResDto, ['access_token']) {}

export class SendCaptchaDto {
  @IsEmail()
  email: string
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @Length(8, 20)
  newPassword: string
  @IsNotEmpty()
  oldPassword: string
}
