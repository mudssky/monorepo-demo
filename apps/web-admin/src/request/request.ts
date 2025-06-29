/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AxiosInstance,
  AxiosInterceptorOptions,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { LoginInterceptor } from './interceptors/request/loginInterceptor'
import { LogInterceptor } from './interceptors/response/logInterceptor'
import { ResInterceptor } from './interceptors/response/resInterceptor'
import { UnauthrizedInterceptor } from './interceptors/response/unauthrizedInterceptor'
// 导入工具函数
export { downloadFile, filesizeFormatter } from '@/request/utils/fileUtils'
export {
  formatProgressMsg,
  handleDownloadProgress,
} from '@/request/utils/progressUtils'

// 封装后端返回值类型
export type ResponseData<T> = {
  code: number
  msg: string
  data: T
  info?: Omit<AxiosResponse, 'data'>
}

export type PromiseResponseData<T> = Promise<ResponseData<T>>

export type CustomInterceptorOptions = AxiosInterceptorOptions

export type CustomInterceptor<V> = [
  onFulfilled?: ((value: V) => V | Promise<V>) | null,
  onRejected?: ((error: any) => any) | null,
  options?: CustomInterceptorOptions,
]

// export type requestInterceptor = CustomInterceptor<AxiosRequestConfig>[0]
export type CustomInterceptors = {
  requestInterceptors?: CustomInterceptor<InternalAxiosRequestConfig<any>>[]
  responseInterceptors?: CustomInterceptor<AxiosResponse<unknown>>[]
}
export interface CustomRequestConfig extends AxiosRequestConfig {
  custom_interceptors?: CustomInterceptors
}
export class Request {
  // axios 实例
  private instance: AxiosInstance
  private config: CustomRequestConfig
  constructor(config: CustomRequestConfig) {
    this.instance = axios.create(config)
    this.config = config
    if (this.config.custom_interceptors) {
      this.setInterceptors(this.config.custom_interceptors)
    }
  }

  // 定义核心请求
  public request(config: CustomRequestConfig): Promise<AxiosResponse> {
    return this.instance.request({ ...this.config, ...config })
  }

  public get<T = any>(
    url: string,
    config?: CustomRequestConfig,
  ): PromiseResponseData<T> {
    return this.instance.get(url, config)
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: CustomRequestConfig,
  ): PromiseResponseData<T> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: CustomRequestConfig,
  ): PromiseResponseData<T> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(
    url: string,
    config?: CustomRequestConfig,
  ): PromiseResponseData<T> {
    return this.instance.delete(url, config)
  }
  setInterceptors(interceptors: CustomInterceptors) {
    // console.log({ interceptors })
    for (const reqi of interceptors?.requestInterceptors ?? []) {
      // console.log({ reqi })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.instance.interceptors.request.use(...reqi)
    }

    for (const resi of interceptors?.responseInterceptors ?? []) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.instance.interceptors.response.use(...resi)
    }
    // console.log('ins', this.instance.interceptors)
  }
}

// 默认配置
const baseConfig = {
  baseURL: import.meta.env.VITE_REQUEST_BASE_URL,
  // timeout: 5000,
  withCredentials: true,
}
const globalRequest = new Request({
  ...baseConfig,
  custom_interceptors: {
    requestInterceptors: [LoginInterceptor],
    responseInterceptors: [
      LogInterceptor,
      UnauthrizedInterceptor,
      ResInterceptor,
    ],
  },
})
export default globalRequest

export const noAuthRequest = new Request({
  ...baseConfig,
  custom_interceptors: {
    responseInterceptors: [LogInterceptor, ResInterceptor],
  },
})
//   // 添加响应拦截器
//   this.instance.interceptors.response.use(
//     function (response) {
//       // 对响应数据做点什么
//       console.log(
//         `%c${response.config.url}`,
//         'background:#2d8cf0; padding: 2px; border-radius: 4px;color: #fff;',
//         response.data,
//         {
//           response,
//         },
//       )
//       if (response.request.responseType === 'blob') {
//         return response
//       }
//       return response.data
//     },
//     // 任何超过2xx范围的状态码，会触发这个函数
//     // 这里用来处理http常见错误，进行全局提示
//     function (error: AxiosError) {
//       let message = ''
//       switch (error.response?.status) {
//         case 400:
//           message = '请求错误(400)'
//           break
//         case 401:
//           message = '未授权，请重新登录(401)'
//           // 这里可以做清空storage并跳转到登录页的操作
//           delLocalStorage('userInfo')
//           window.location.reload()
//           break
//         case 403:
//           message = '拒绝访问(403)'
//           break
//         case 404:
//           message = '请求出错(404)'
//           break
//         case 408:
//           message = '请求超时(408)'
//           break
//         case 500:
//           message = '服务器错误(500)'
//           break
//         case 501:
//           message = '服务未实现(501)'
//           break
//         case 502:
//           message = '网络错误(502)'
//           break
//         case 503:
//           message = '服务不可用(503)'
//           break
//         case 504:
//           message = '网络超时(504)'
//           break
//         case 505:
//           message = 'HTTP版本不受支持(505)'
//           break
//         default:
//           message = `连接出错(${error.response?.status})!`
//       }
//       if (error.response) {
//         notification.error({
//           message: error.response.statusText,
//           description: message,
//         })
//       }
//     },
//   )
