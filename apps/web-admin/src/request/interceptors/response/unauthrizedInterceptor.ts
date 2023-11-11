import { CustomInterceptor } from '@/request/request'
import { globalRouter } from '@/router'
import { message } from 'antd'
import { AxiosError, AxiosResponse } from 'axios'
import { t } from 'i18next'

/**
 * 检查登录状态的拦截器，如果后端返回状态码401，说明未登录或者登录过期，需要跳转到登录界面
 */
export const UnauthrizedInterceptor: CustomInterceptor<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AxiosResponse<any>
> = [
  function (response) {
    // if (response.status === 401) {
    //   message.error('未登录或登录已过期，请重新登录')
    //   globalRouter.navigate('/login')
    // }
    return response
  },
  function (error: AxiosError) {
    // axios 默认401状态码会报错
    if (error.code === 'ERR_BAD_REQUEST') {
      message.error(t('login-outdated-please-login-again'))
      globalRouter.navigate('/login')
    }
    return Promise.reject(error)
  },
]
