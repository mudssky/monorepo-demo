import { GlobalStorage } from '@/global/storage'
import request, { noAuthRequest } from '@/request/request'
import { globalRouter } from '@/router'

import { message } from 'antd'
import { t } from 'i18next'
import {
  ChangePasswordDto,
  GithubCallbackDto,
  LoginReq,
  LoginRes,
  RegisterReq,
  SendCaptchaDto,
} from './types'

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

export function AUTH_GITHUB(params: GithubCallbackDto) {
  return noAuthRequest.get('/auth/githubLoginCallback', { params })
}

export function AUTH_GOOGLE(params: GithubCallbackDto) {
  return noAuthRequest.get('/auth/googleLoginCallback', { params })
}

/**
 * 发送验证码
 * @param params
 * @returns
 */
export function SEND_CAPTCHA(params: SendCaptchaDto) {
  return noAuthRequest.post('/auth/sendRegisterCaptcha', { ...params })
}

/**
 * 发送忘记密码验证码
 * @param params
 * @returns
 */
export function SEND_FORGET_PASSWORD_CAPTCHA(params: SendCaptchaDto) {
  return noAuthRequest.post('/auth/sendForgetPasswordCaptcha', { ...params })
}

/**
 * 发送修改密码验证码
 * @param params
 * @returns
 */
export function SEND_CHANGE_PASSWORD_CAPTCHA(params: SendCaptchaDto) {
  return noAuthRequest.post('/auth/sendChangePasswordCaptcha', { ...params })
}

/**
 * 修改密码
 * @param params
 * @returns
 */
export function CHANGE_PASSWORD(params: ChangePasswordDto) {
  return request.post('/auth/changePassword', { ...params })
}
