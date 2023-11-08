import { GlobalStorage } from '@/global/storage'
import { CustomInterceptor } from '@/request/request'
import { globalRouter } from '@/router'
import { InternalAxiosRequestConfig } from 'axios'
import { t } from 'i18next'
export const LoginInterceptor: CustomInterceptor<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InternalAxiosRequestConfig<any>
> = [
  function (config) {
    const token = GlobalStorage.getStorageSync('TOKEN')

    if (!token) {
      globalRouter.navigate('/login', {
        replace: true,
      })
      return Promise.reject(t('need login'))
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   @ts-ignore
    config.headers.Authorization = `Bearer ${token}`
    // 配置 bearer token 认证
    return config
  },
]
