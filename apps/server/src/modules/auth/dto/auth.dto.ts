import { ApiProperty, OmitType } from '@nestjs/swagger'

import { $Enums } from '@prisma/client'
import { IsEmail, IsNotEmpty, Length } from 'class-validator'
import type { LoginReq, LoginRes } from '../types'

export class LoginDto implements LoginReq {
  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: '可以传入用户名或邮箱',
    example: 'admin',
  })
  @IsNotEmpty()
  username: string
}
export class GithubCallbackDto {
  code: string
}
export class LoginResDto implements LoginRes {
  nickName: string | null
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
  id: string
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
  @IsNotEmpty()
  captcha: string
  @IsEmail()
  email: string
}
