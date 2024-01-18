import { CatsModule } from '@/modules/cats/cats.module'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
// import { PigsModule } from '@/modules/pigs/pigs.module'
import config, { validate } from '@/common/config/config'
import { ResponseInterceptor } from '@/common/interceptors/response/response.interceptor'
import { LoggerMiddleware } from '@/common/middlewares/logger/logger.middleware'
import { GlobalValidationPipe } from '@/common/pipes/global-validation/global-validation.pipe'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth/jwt-auth.guard'
import { GlobalLoggerModule } from '@/modules/logger/logger.module'
import { SystemMonitorModule } from '@/modules/system-monitor/system-monitor.module'
import { UserModule } from '@/modules/user/user.module'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import path from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GlobalExceptionFilter } from './common/filters/http-exception/http-exception.filter'
import { AuthModule } from './modules/auth/auth.module'
import { CustomCacheModule } from './modules/custom-cache/custom-cache.module'
import { HealthModule } from './modules/health/health.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { FileModule } from './modules/upload-file/upload-file.module'
@Module({
  imports: [
    CatsModule,
    // PigsModule,
    UserModule,
    // 全局加载环境变量配置
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? ['.env.production', '.env']
          : ['.env.local', '.env.development'],
      isGlobal: true,
      load: [config],
      cache: true, //缓存，提升访问.env的性能
      validate,
    }),
    // 静态文件路径配置
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploadTemp'),
      //服务器根路径配置
      serveRoot: '/uploadTemp',
      serveStaticOptions: {
        // 缓存控制
        cacheControl: true,
        // 设为true后碰到目录会查找目录下的index.html
        index: false,
        // 尾部是/的时候重定向
        redirect: true,
      },
    }),
    CustomCacheModule,
    PrismaModule,
    GlobalLoggerModule,
    AuthModule,
    // websocket 网关
    SystemMonitorModule,
    HealthModule,
    FileModule,
  ],
  controllers: [AppController],
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
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AppService,
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
