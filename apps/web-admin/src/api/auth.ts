import request from '@/request/request'
import { LoginReq, LoginRes, RegisterReq } from '@server/src/modules/auth/types'
import { GlobalStorage } from '@/global/storage'
import { message } from 'antd'
import { t } from 'i18next'
import { globalRouter } from '@/router'

export function LOGIN(params: LoginReq) {
  return request.post<LoginRes>('/auth/login', params)
}

export function REGISTER(params: RegisterReq) {
  return request.post<LoginRes>('/auth/register', params)
}

export function isLogin() {
  const token = GlobalStorage.getStorageSync('TOKEN')
  return !!token
}

export function checkLogin() {
  if (!isLogin()) {
    message.success(t('need login'))
    globalRouter.navigate('/login', {
      replace: true,
    })
    return false
  }
  return true
}
