import { ConfigurableModuleBuilder } from '@nestjs/common'
import { RedisOptions } from 'ioredis'

export interface RedisModuleOptions {
  redisOptions?: RedisOptions
  // isGlobal?: boolean
}

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<RedisModuleOptions>()
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
