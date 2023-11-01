import { HttpExceptionOptions, HttpStatus } from '@nestjs/common'
import { BaseException } from './base'

export class DatabaseException extends BaseException {
  constructor(
    message: string,
    statusCode = HttpStatus.BAD_REQUEST,
    options?: HttpExceptionOptions,
  ) {
    super(message, statusCode, options)
  }
}
