import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from '../../types'

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

    const client = context.switchToWs().getClient()
    const { handshake } = client
    const { headers } = handshake
    if (!headers?.authorization) {
      this.logger.error('ws jwt auth failed')
      return false
    }
    try {
      // 应该直接发送token，不需要bearer 前缀
      const jwtPayload: JwtPayload = await this.jwtService.verifyAsync(
        headers.authorization,
      )

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
