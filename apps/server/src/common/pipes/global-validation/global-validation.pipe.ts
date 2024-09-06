import { ValidationException } from '@/common/exceptions/validation'
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common'

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true, // 启用类转换
      // whitelist: true, // 仅保留DTO中声明的属性
      // forbidNonWhitelisted: true, // 阻止非白名单属性
    })
  }
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
      throw e
    }
  }
}
