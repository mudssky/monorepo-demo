import { CustomInterceptor } from '@/request/request'
import { AxiosError, AxiosResponse } from 'axios'

/**
 * 输出响应log的拦截器
 */
export const LogInterceptor: CustomInterceptor<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AxiosResponse<any>
> = [
  function (response) {
    console.log(
      `%c${response.config.url}`,
      'background:#2d8cf0; padding: 2px; border-radius: 4px;color: #fff;',
      response.data,
      {
        response,
      },
    )
    return response
  },
  function (error: AxiosError) {
    return Promise.reject(error)
  },
]
