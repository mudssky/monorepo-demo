import config, { validate } from '@/common/config/config'
import { ResponseInterceptor } from '@/common/interceptors/response/response.interceptor'
import { GlobalValidationPipe } from '@/common/pipes/global-validation/global-validation.pipe'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import * as path from 'node:path'
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard'
import { CustomCacheModule } from '../custom-cache/custom-cache.module'
import { GlobalLoggerModule } from '../logger/logger.module'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [
    // 全局加载环境变量配置
    ConfigModule.forRoot({
      envFilePath: [path.resolve(__dirname, '../../../.env.development')],
      isGlobal: true,
      load: [config],
      cache: true, //缓存，提升访问.env的性能
      validate,
    }),
    CustomCacheModule,
    PrismaModule,
    GlobalLoggerModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    {
      // 全局响应拦截器，用于封装统一的消息格式 {code,msg,data}
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // 全局jwt认证，使用@public装饰器可以绕过
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // 所有GET请求加缓存
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class MockGlobalModule {}
