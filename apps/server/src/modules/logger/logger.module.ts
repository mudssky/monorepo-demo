import { Global, Module } from '@nestjs/common'
import { GlobalLoggerService } from './logger.service'

// 注册为全局模块，省的每次导入
@Global()
@Module({
  providers: [GlobalLoggerService],
  exports: [GlobalLoggerService],
})
export class GlobalLoggerModule {}
