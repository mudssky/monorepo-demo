import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: GlobalLoggerService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const dayjs = (await import('dayjs')).default
    // console.log({ dayjs })
    const start = dayjs()
    res.on('finish', () => {
      const cost = dayjs().diff(start, 'milliseconds')
      this.logger.debug({
        status: res.statusCode,
        method: req.method,
        path: req.path,
        url: req.url,
        ip: req.ip,
        query: req.query,
        userAgent: req.get('User-Agent'),
        body: req.body,
        params: req.params,
        cost,
      })
    })
    next()
  }
}
