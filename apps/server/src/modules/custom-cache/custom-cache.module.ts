import { SECOND } from '@/common/constant'
import KeyvRedis from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigService } from '@nestjs/config/dist/config.service'
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        if (configService.get('CACHE_TYPE') === 'memory') {
          return {
            ttl: 5 * SECOND, //5秒过期时间
            max: 1000, //最多缓存项目数
            isGlobal: true, //注册为全局模块，这样就不需要在其他模块导入了
          }
        }
        // const redisUrl = `redis://${configService.get('REDIS_HOST') ?? 'localhost'}:${configService.get('REDIS_PORT') ?? 6379}`
        return {
          stores: [
            new KeyvRedis({
              // url: redisUrl,
              socket: {
                host: configService.get('REDIS_HOST') ?? 'localhost',
                port: configService.get('REDIS_PORT') ?? 6379,
              },
            }),
          ],
          ttl: 5 * SECOND, //5秒过期时间
          max: 1000, //最多缓存项目数
          isGlobal: true, //注册为全局模块，这样就不需要在其他模块导入了
        }
      },
      inject: [ConfigService],
    }),
  ],

  exports: [CacheModule],
})
export class CustomCacheModule {}

// CacheModule.register<RedisOptions>({
//   store: redisStore,
//   host: 'localhost',
//   port: 6379,
//   isGlobal: true, //注册为全局模块，这样就不需要在其他模块导入了
// ttl: 5000, //5秒过期时间
// max: 1000, //最多缓存项目数
// }),
