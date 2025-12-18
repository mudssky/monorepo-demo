import { ConfigurableModuleBuilder } from '@nestjs/common'

import { LoggerOptions } from 'winston'
export interface GlobolLoggerModuleOptions {
  winstonConfig?: LoggerOptions
  isGlobal?: boolean
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<GlobolLoggerModuleOptions>()
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .setClassMethodName('forRoot')
  .build()
