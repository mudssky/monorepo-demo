import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { CatsModule } from './cats/cats.module'
import { PigsModule } from './pigs/pigs.module'
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware'
@Module({
  imports: [CatsModule, PigsModule],
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
