import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common'

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode = HttpStatus.OK,
    options?: HttpExceptionOptions,
  ) {
    super(message, statusCode, options)
  }
}
