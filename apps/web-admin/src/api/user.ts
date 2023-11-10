import request from '@/request/request'

import { User } from '@server/node_modules/@prisma/client'

export function GET_USER_INFO() {
  return request.get<User>('/user/userInfo')
}
