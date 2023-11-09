import { User } from '@prisma/client'
export type LoginReq = Pick<User, 'password'>

export interface LoginRes extends User {
  access_token: string
}

export type RegisterReq = Pick<User, 'email' | 'name' | 'password'>
