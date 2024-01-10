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
      // 因为管道默认报错是400，这里捕获这个错误抛出自定义异常
      if (e instanceof BadRequestException) {
        console.log('自定义异常', (e as unknown as any)?.response?.message)
        // 这里重写验证管道，拿出验证信息
        throw new ValidationException((e as unknown as any)?.response?.message)
      }
    }
    return value
  }
}
