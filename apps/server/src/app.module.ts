import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { CatsModule } from '@/modules/cats/cats.module'
import { PigsModule } from '@/modules/pigs/pigs.module'
import { LoggerMiddleware } from '@/common/middlewares/logger/logger.middleware'

import { UserModule } from '@/modules/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ResponseInterceptor } from '@/common/interceptors/response/response.interceptor'
import { GlobalValidationPipe } from '@/common/pipes/global-validation/global-validation.pipe'
import { GlobalLoggerModule } from '@/modules/logger/logger.module'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth/jwt-auth.guard'
import config from '@/common/config/config'
import { SystemMonitorGatewayModule } from './gateways/system-monitor/system-monitor.module'
@Module({
  imports: [
    CatsModule,
    PigsModule,
    UserModule,
    // 全局加载环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      cache: true, //缓存，提升访问.env的性能
    }),
    PrismaModule,
    GlobalLoggerModule,
    AuthModule,
    // websocket 网关
    SystemMonitorGatewayModule,
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
    // {
    //   provide: APP_FILTER,
    //   useClass: GlobalExceptionFilter,
    // },
  ],
})

// 需要实现NestModule 才能注册中间件
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 对所有路由应用
    consumer.apply(LoggerMiddleware).forRoutes('*')

    // 路由支持通配符
    // forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
  }
}
