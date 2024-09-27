/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalStorage } from '@/global/storage'
import { singletonProxy } from '@mudssky/jsutils'
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client'

type CustomSocketIOOptions = Partial<ManagerOptions & SocketOptions>

class CustomSocketIO {
  public socket: Socket

  constructor(opts: CustomSocketIOOptions = globalSocketIOConfig) {
    this.socket = io(opts)
  }

  emit(ev: string, ...args: any[]) {
    this.socket.emit(ev, ...args)
  }
  async emitWithAck(ev: string, ...args: any[]) {
    const res = await this.socket.emitWithAck(ev, ...args)
    return res
  }
  on(ev: string, listener: (...args: any[]) => void) {
    this.socket.on(ev, listener)
  }
}

export const globalSocketIOConfig: CustomSocketIOOptions = {
  //   auth: {
  //     token: GlobalStorage.getStorageSync('TOKEN'),
  //   },
  // 因为希望调用时获取token，所以这里用回调函数
  auth: (cb) => {
    cb({ token: GlobalStorage.getStorageSync('TOKEN') })
  },
}
/**
 * 因为登录才有token的原因，不能直接创建，要先判断登录状态，这样才能创建socket连接，共用登录的token
 * 所以包装一个单例，让用户在使用到的地方调用
 */
export const singleTonCustomSocket = singletonProxy(CustomSocketIO)
