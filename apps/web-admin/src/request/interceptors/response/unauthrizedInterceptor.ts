import { GlobalStorage } from '@/global/storage'
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
    console.log({ error })

    // axios 默认401状态码会报错(200~300区间外就报错)
    if (error.response?.status === 401) {
      message.error(t('login-outdated-please-login-again'))
      // 未登录状态需要清除缓存
      GlobalStorage.clearStorageSync()
      globalRouter.navigate('/login')
    }
    return Promise.reject(error)
  },
]
