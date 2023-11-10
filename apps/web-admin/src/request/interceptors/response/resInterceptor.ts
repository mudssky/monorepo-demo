import { CustomInterceptor } from '@/request/request'
import { AxiosError, AxiosResponse } from 'axios'
/**
 * 包装响应体的拦截器, 因为改变了response格式，所以要放在拦截器的最后
 */
export const ResInterceptor: CustomInterceptor<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AxiosResponse<any>
> = [
  function (response) {
    const { data, ...rest } = response
    return {
      ...data,
      info: rest,
    }
  },
  function (error: AxiosError) {
    return Promise.reject(error)
  },
]
