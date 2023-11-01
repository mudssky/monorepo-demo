import { GlobalApiResponse } from '@/common/dto/response.dto'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    // const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    console.log({ exception })

    response.status(status).json(
      // @ts-ignore
      GlobalApiResponse.Fail(exception.response.message, {
        statusCode: status,
        // path:request.url
      }),
    )
  }
}
