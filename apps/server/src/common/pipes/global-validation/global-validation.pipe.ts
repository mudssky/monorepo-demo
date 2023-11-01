import { ValidationException } from '@/common/exceptions/validation'
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common'

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata)
    } catch (e) {
      if (e instanceof BadRequestException) {
        // 这里重写验证管道，拿出验证信息
        throw new ValidationException((e as unknown as any)?.response?.message)
      }
    }
  }
}
