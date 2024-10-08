import request from '@/request/request'

import { UpdateUserDtoType, UserDtoType } from '@server/src/modules/user/types'
import { LoginRes } from './auth/types'

export function GET_USER_INFO() {
  return request.get<LoginRes>('/user/userInfo')
}

export function UPDATE_USER_INFO(param: UpdateUserDtoType) {
  return request.put<UserDtoType>('/user/user', param)
}
