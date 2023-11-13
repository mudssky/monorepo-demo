import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from '../../types'
import { Socket } from 'socket.io'

/**
 * 从socket.io,发送的header中提取jwt token进行鉴权。
 * 前端传递token的方式目前已知3种
 * 1.在请求地址上拼接查询字符串,可以用 socket.handshake.query获取到
 * 2.放到header中，比如
 * ```ts
 *     const socket = io(link, {
      extraHeaders: {
        authorization: GlobalStorage.getStorageSync('TOKEN'),
      },
    })
 * ```
    3.使用socket.io官方提供的auth参数，
    ```ts
    const socket = io({
  auth: {
    token: "abcd"
  }
});
    ```

    目前兼容了方法2和方法3，先从auth参数获取，没有则从header获取
 */
@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    private logger: GlobalLoggerService,
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    this.logger.setContext({ label: WsJwtAuthGuard.name })
  }
  async canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    // 判断是否是public装饰器，添加这个装饰器的请求，直接通过校验
    // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ])
    // if (isPublic) {
    //   return true
    // }

    const client: Socket = context.switchToWs().getClient()
    const { handshake } = client
    const { headers } = handshake
    //兼容一下socket.io提供的token传参
    const token = handshake?.auth?.token ?? headers?.authorization ?? ''
    if (!token) {
      this.logger.error('ws jwt auth failed')
      return false
    }
    try {
      // 应该直接发送token，不需要bearer 前缀
      const jwtPayload: JwtPayload = await this.jwtService.verifyAsync(token)
      // 把解析的jwtPayload，挂载到从客户端接收的data上
      context.switchToWs().getData().jwtPayload = jwtPayload
      if (!jwtPayload) {
        return false
      }
    } catch {
      this.logger.error('ws jwt auth failed')
      return false
    }

    return true
  }
}
