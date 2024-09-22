import { DynamicModule, Module } from '@nestjs/common'
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './cofig.module-definition'
import { RedisService } from './redis.service'

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule extends ConfigurableModuleClass {
  // static forRoot(options?: RedisModuleOptions): DynamicModule {
  //   const { isGlobal = true } = options || {}
  //   return {
  //     module: RedisModule,
  //     providers: [
  //       {
  //         provide: GLOBAL_REDIS_OPTIONS,
  //         useValue: options,
  //       },
  //       RedisService,
  //     ],
  //     exports: [RedisService],
  //     global: isGlobal,
  //   }
  // }
  // static async forRootAsync(options: {
  //   useFactory: (...args: any[]) => Promise<RedisModuleOptions>
  //   isGlobal?: boolean
  //   inject?: any[]
  // }): Promise<DynamicModule> {
  //   const { useFactory, isGlobal = true, inject = [] } = options
  //   const redisOptionsProvider: Provider = {
  //     provide: GLOBAL_REDIS_OPTIONS,
  //     useFactory: async (...args: any[]) => {
  //       const modOptions = await useFactory(...args)
  //       return modOptions
  //     },
  //     inject,
  //   }
  //   return {
  //     module: RedisModule,
  //     providers: [redisOptionsProvider, RedisService],
  //     exports: [RedisService],
  //     global: isGlobal,
  //   }
  // }
  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.forRoot(options),
    }
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.forRootAsync(options),
    }
  }
}
