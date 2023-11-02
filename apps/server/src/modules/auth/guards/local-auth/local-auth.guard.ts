import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

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
