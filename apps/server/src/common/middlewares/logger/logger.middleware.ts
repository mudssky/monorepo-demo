import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: GlobalLoggerService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const dayjs = (await import('dayjs')).default
    // console.log({ dayjs })
    const start = dayjs()

    next()

    // 请求接收后打印信息,放在next（）之后是因为要等一些中间件执行完，才能获得路径等信息
    this.logger.debug({
      label: 'enter router',
      method: req.method,
      path: req.path,
      url: req.url,
      ip: req.ip,
      query: req.query,
      userAgent: req.get('User-Agent'),
      body: req.body,
    })

    // 响应结束后打印信息
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
        // header: req.headers,
        cost,
      })
    })
  }
}
