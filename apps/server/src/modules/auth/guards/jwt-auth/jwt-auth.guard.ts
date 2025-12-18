import { GlobalLoggerService } from '@monorepo-demo/logger'
import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { GuardException } from '@/common/exceptions/guard'
import { IS_PUBLIC_KEY } from '../../auth.decorator'

export function checkIsPublic(
  context: ExecutionContext,
  reflector: Reflector,
): boolean {
  const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ])
  return !!isPublic
}
// 也可以继承一系列策略
// export class JwtAuthGuard extends AuthGuard(['strategy_jwt_1', 'strategy_jwt_2', '...']) { ... }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private logger: GlobalLoggerService,
    private reflector: Reflector,
  ) {
    super()
  }
  canActivate(context: ExecutionContext) {
    // console.log('jwt auth')
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    // 判断是否是public装饰器，添加这个装饰器的请求，直接通过校验

    if (checkIsPublic(context, this.reflector)) {
      return true
    }
    return super.canActivate(context)
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      this.logger.warn({
        messgae: 'token 验证失败',
        user,
        info,
        err,
      })
      throw err || new GuardException('token 验证失败', HttpStatus.UNAUTHORIZED)
    }
    return user
  }
}
