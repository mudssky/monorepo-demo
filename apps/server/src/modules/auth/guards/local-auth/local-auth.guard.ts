import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * 这个Guard实际上执行的是localStrategy,因为使用继承重写了passport的localStrategy，所以执行的是重写后的方法。
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    // const canVisit =  super.canActivate(context)
    // if (!canVisit) {
    //   throw new GuardException('auth failed')
    // }
    // console.log({ canVisit })

    // return canVisit
    return super.canActivate(context)
  }
}
