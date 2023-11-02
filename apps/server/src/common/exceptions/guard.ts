import { HttpStatus, HttpExceptionOptions } from '@nestjs/common'
import { BaseException } from './base'

export class GuardException extends BaseException {
  constructor(
    message: string,
    statusCode?: HttpStatus,
    options?: HttpExceptionOptions,
  ) {
    super(message, statusCode, options)
  }
}
