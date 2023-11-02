import { GuardException } from '@/common/exceptions/guard'
import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from '../../auth.decorator'

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
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    // 判断是否是public装饰器，添加这个装饰器的请求，直接通过校验
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
