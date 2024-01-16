import { HttpExceptionOptions, HttpStatus } from '@nestjs/common'
import { BaseException } from './base'
export * from './base'
export * from './database'
export * from './guard'
export * from './validation'

export class FileException extends BaseException {
  constructor(
    message: string,
    statusCode?: HttpStatus,
    options?: HttpExceptionOptions,
  ) {
    super(message, statusCode, options)
  }
}
