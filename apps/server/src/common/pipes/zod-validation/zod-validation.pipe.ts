import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'
import { ZodObject } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value)
    } catch (error) {
      throw new BadRequestException('Validation failed')
    }
    return value
  }
}
