import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { CatsModule } from '@/modules/cats/cats.module'
import { PigsModule } from '@/modules/pigs/pigs.module'
import { LoggerMiddleware } from '@/common/middlewares/logger/logger.middleware'

import { UserModule } from '@/modules/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ResponseInterceptor } from '@/common/interceptors/response/response.interceptor'
import { GlobalValidationPipe } from '@/common/pipes/global-validation/global-validation.pipe'

@Module({
  imports: [
    CatsModule,
    PigsModule,
    UserModule,
    // 全局加载环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
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
    // {
    //   provide: APP_FILTER,
    //   useClass: GlobalExceptionFilter,
    // },
  ],
})

// 需要实现NestModule 才能注册中间件
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('cats')
    // 可以进一步限制请求类型
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET })

    // 路由支持通配符
    // forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
  }
}
