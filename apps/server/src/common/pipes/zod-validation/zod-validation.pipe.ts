import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common'
import { ZodObject } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException('Validation failed')
    }
  }
}
