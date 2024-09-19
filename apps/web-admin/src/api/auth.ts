import { GlobalStorage } from '@/global/storage'
import request, { noAuthRequest } from '@/request/request'
import { globalRouter } from '@/router'
import {
  ChangePasswordDto,
  GithubCallbackDto,
  SendCaptchaDto,
} from '@server/src/modules/auth/dto/auth.dto'
import { LoginReq, LoginRes, RegisterReq } from '@server/src/modules/auth/types'
import { message } from 'antd'
import { t } from 'i18next'

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

export type AuthGithubParams = InstanceType<typeof GithubCallbackDto>
export function AUTH_GITHUB(params: AuthGithubParams) {
  return noAuthRequest.get('/auth/githubLoginCallback', { params })
}

export function AUTH_GOOGLE(params: AuthGithubParams) {
  return noAuthRequest.get('/auth/googleLoginCallback', { params })
}

/**
 * 发送验证码
 * @param params
 * @returns
 */
export function SEND_CAPTCHA(params: SendCaptchaDto) {
  return noAuthRequest.post('/auth/sendCaptcha', { ...params })
}

/**
 * 修改密码
 * @param params
 * @returns
 */
export function CHANGE_PASSWORD(params: ChangePasswordDto) {
  return request.post('/auth/changePassword', { ...params })
}
