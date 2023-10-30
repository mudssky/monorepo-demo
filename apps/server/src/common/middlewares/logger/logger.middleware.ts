import { Injectable, NestMiddleware } from '@nestjs/common'
import { pick } from 'lodash'
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log({ ...pick(req, ['body', 'query']) })

    next()
  }
}
