import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { omit, pick } from '@mudssky/jsutils'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

function bodyShowMessage(req: Request) {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return {
      ...omit(req.body, ['file']),
      file: '文件内容太长，不打印',
    }
  }
  return req.body
}
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
      headers: pick(req.headers, ['content-type']),
      body: bodyShowMessage(req),
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
        body: bodyShowMessage(req),
        params: req.params,
        headers: pick(req.headers, ['content-type']),
        cost,
      })
    })
  }
}
