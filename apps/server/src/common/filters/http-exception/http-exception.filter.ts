import { GlobalApiResponse } from '@/common/dto/response.dto'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

/**
 * 除了部分错误码（401）放行，其余的都返回200,实际返回的错误码放到响应的error对象里可以看。
 * @param status
 * @returns
 */
function JudgeStatus(status: number) {
  if ([HttpStatus.UNAUTHORIZED].includes(status)) {
    return status
  }
  return HttpStatus.OK
}
@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    // const request = ctx.getRequest<Request>()
    const status = JudgeStatus(exception.getStatus() ?? HttpStatus.OK)
    // console.log({ exception }, exception.getResponse())

    // 全局捕获错误之后，默认是200
    response.status(status).json(GlobalApiResponse.Fail(exception))
  }
}
