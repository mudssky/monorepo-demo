import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common'
import { GlobalApiResponse } from '../dto/response.dto'

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode = HttpStatus.BAD_REQUEST,
    options?: HttpExceptionOptions,
  ) {
    super(
      GlobalApiResponse.Fail(message, {
        statusCode: statusCode,
      }),
      statusCode,
      options,
    )
  }
}
