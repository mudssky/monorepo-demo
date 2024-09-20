import { User } from '@server/node_modules/prisma/prisma-client'
export type ChangePasswordDto = {
  newPassword: string
  oldPassword: string
}

export interface GithubCallbackDto {
  code: string
}

export interface SendCaptchaDto {
  email: string
}

export type LoginReq = Pick<User, 'password'>

export interface LoginRes extends Omit<User, 'password'> {
  access_token?: string
  avatarFullUrl?: string | null
}

export type RegisterReq = Pick<User, 'email' | 'name' | 'password'> & {
  captcha: string
}
