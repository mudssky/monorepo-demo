import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { CatsModule } from '@/modules/cats/cats.module'
import { PigsModule } from '@/modules/pigs/pigs.module'
import { LoggerMiddleware } from '@/common/middlewares/logger/logger.middleware'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { UserModule } from '@/modules/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    CatsModule,
    PigsModule,
    UserModule,
    ConfigModule.forRoot(),
    AuthModule,
  ],
  providers: [PrismaService],
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
