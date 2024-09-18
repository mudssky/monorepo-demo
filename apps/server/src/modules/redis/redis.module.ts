import { DynamicModule, Module, Provider } from '@nestjs/common'
import { RedisOptions } from 'ioredis'
import { GLOBAL_REDIS_OPTIONS } from './constant'
import { RedisService } from './redis.service'

export interface RedisModuleOptions {
  redisOptions?: RedisOptions
  isGlobal?: boolean
}
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  static forRoot(options?: RedisModuleOptions): DynamicModule {
    const { isGlobal = true } = options || {}
    return {
      module: RedisModule,
      providers: [
        {
          provide: GLOBAL_REDIS_OPTIONS,
          useValue: options,
        },
        RedisService,
      ],
      exports: [RedisService],
      global: isGlobal,
    }
  }
  static async forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<RedisModuleOptions>
    isGlobal?: boolean
    inject?: any[]
  }): Promise<DynamicModule> {
    const { useFactory, isGlobal = true, inject = [] } = options

    const redisOptionsProvider: Provider = {
      provide: GLOBAL_REDIS_OPTIONS,
      useFactory: async (...args: any[]) => {
        const modOptions = await useFactory(...args)
        return modOptions
      },
      inject,
    }

    return {
      module: RedisModule,
      providers: [redisOptionsProvider, RedisService],
      exports: [RedisService],
      global: isGlobal,
    }
  }
}
