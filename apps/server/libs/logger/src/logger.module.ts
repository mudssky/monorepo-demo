import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './cofig.module-definition'
import { GlobalLoggerService } from './logger.service'

// 注册为全局模块，省的每次导入

@Module({
  providers: [GlobalLoggerService],
  exports: [GlobalLoggerService],
})
export class GlobalLoggerModule extends ConfigurableModuleClass {}
