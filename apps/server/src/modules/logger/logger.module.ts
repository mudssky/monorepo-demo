import { DynamicModule, Global, Module } from '@nestjs/common'
import { GlobalLoggerService } from './logger.service'
import { LoggerOptions } from 'winston'

// 注册为全局模块，省的每次导入

export const GLOBAL_LOGGER_OPTIONS = 'GLOBAL_LOGGER_OPTIONS'

@Module({})
export class GlobalLoggerModule {
  static forRoot(options?: LoggerOptions): DynamicModule {
    return {
      module: GlobalLoggerModule,
      providers: [
        {
          provide: GLOBAL_LOGGER_OPTIONS,
          useValue: options,
        },
        GlobalLoggerService,
      ],
      exports: [GlobalLoggerService],
      global: true,
    }
  }
}
