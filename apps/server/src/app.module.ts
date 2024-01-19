import { CatsModule } from '@/modules/cats/cats.module'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
// import { PigsModule } from '@/modules/pigs/pigs.module'
import { LoggerMiddleware } from '@/common/middlewares/logger/logger.middleware'
import { SystemMonitorModule } from '@/modules/system-monitor/system-monitor.module'
import { UserModule } from '@/modules/user/user.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { GlobalModule } from './modules/global/global.module'
import { HealthModule } from './modules/health/health.module'
import { FileModule } from './modules/upload-file/upload-file.module'
@Module({
  imports: [
    CatsModule,
    // PigsModule,
    UserModule,
    AuthModule,
    // websocket 网关
    SystemMonitorModule,
    HealthModule,
    FileModule,
    // 全局加载的模块，放在一起
    GlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
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
