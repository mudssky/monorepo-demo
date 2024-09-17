import {
  EnvironmentVariables,
  getEnvConfig,
  validate,
} from '@/common/config/config'
import { GlobalExceptionFilter } from '@/common/filters/http-exception/http-exception.filter'
import { ResponseInterceptor } from '@/common/interceptors/response/response.interceptor'
import { GlobalValidationPipe } from '@/common/pipes/global-validation/global-validation.pipe'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import path from 'path'
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard'
import { CustomCacheModule } from '../custom-cache/custom-cache.module'
import { GlobalLoggerModule } from '../logger/logger.module'
import { PrismaModule } from '../prisma/prisma.module'
import { SharedService } from './shared.service'

@Global()
@Module({
  imports: [
    // 全局加载环境变量配置
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? ['.env.production.local', '.env.production', '.env']
          : ['.env.development.local', '.env.development'],
      isGlobal: true,
      load: [getEnvConfig],
      cache: true, //缓存，提升访问.env的性能
      validate,
    }),
    // 静态文件路径配置
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const staticFolder = configService.get('STATIC_DIR')
        // const uploadTemp = configService.get('UPLOAD_TEMP')

        // 可以配置多个静态目录
        return [
          {
            //放到global模块后路径加了2层
            rootPath: path.join(__dirname, '../../../', staticFolder),
            //服务器根路径配置
            serveRoot: `/${staticFolder}`,
            serveStaticOptions: {
              // 缓存控制
              cacheControl: true,
              // 设为true后碰到目录会查找目录下的index.html
              index: false,
              // 尾部是/的时候重定向
              redirect: true,
            },
          },
          // {
          //   rootPath: path.join(__dirname, '..', uploadTemp),
          //   //服务器根路径配置
          //   serveRoot: uploadTemp,
          //   serveStaticOptions: {
          //     // 缓存控制
          //     cacheControl: true,
          //     // 设为true后碰到目录会查找目录下的index.html
          //     index: false,
          //     // 尾部是/的时候重定向
          //     redirect: true,
          //   },
          // },
        ]
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    CustomCacheModule,
    GlobalLoggerModule.forRoot(),
    ScheduleModule.forRoot(),
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
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    SharedService,
  ],
  //   暴露出来，以便全局访问
  exports: [SharedService],
})
export class GlobalModule {}
