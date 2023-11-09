import request from '@/request/request'
import { LoginReq } from '@server/src/modules/auth/dto/auth.dto'
import { LoginRes } from '@server/src/modules/auth/auth.service'
import { GlobalStorage } from '@/global/storage'
import { message } from 'antd'
import { t } from 'i18next'
import { globalRouter } from '@/router'

export function LOGIN(params: LoginReq) {
  return request.post<LoginRes>('/auth/login', params)
}

export function CheckLogin() {
  const token = GlobalStorage.getStorageSync('TOKEN')
  if (!token) {
    message.success(t('need login'))
    globalRouter.navigate('/login', {
      replace: true,
    })
    return false
  }
  return true
}
