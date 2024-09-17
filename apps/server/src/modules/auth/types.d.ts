import { $Enums, User } from '@prisma/client'
export type LoginReq = Pick<User, 'password'>

export interface LoginRes extends Omit<User, 'password'> {
  access_token?: string
  avatarFullUrl?: string | null
}

export type RegisterReq = Pick<User, 'email' | 'name' | 'password'>

export type JwtPayload = {
  username: string
  /*  用户id*/
  sub: number
  role: $Enums.Role
  iat: number
}
