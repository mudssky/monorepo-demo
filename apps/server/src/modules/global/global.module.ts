import {
  EnvironmentVariables,
  getEnvConfig,
  validate,
} from '@/common/config/config'
import { GlobalExceptionFilter } from '@/common/filters/http-exception/http-exception.filter'
import { ResponseInterceptor } from '@/common/interceptors/response/response.interceptor'
import { GlobalValidationPipe } from '@/common/pipes/global-validation/global-validation.pipe'
import { EmailModule } from '@/modules/email/email.module'
import {
  GlobalLoggerModule,
  RedisModule,
  commonFileFormat,
  customLogFormat,
} from '@lib'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import path from 'path'
import winston from 'winston'
import { CasbinAuthGuard } from '../auth/guards/casbin-auth.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard'
import { CustomCacheModule } from '../custom-cache/custom-cache.module'
import { MinioModule } from '../minio/minio.module'
import { PrismaModule } from '../prisma/prisma.module'
import { SharedService } from './shared.service'
import { MB } from '@/common/constant'

const commonFileLoggerConfig = {
  format: commonFileFormat,
  maxsize: 10 * MB, // 10MB
  maxFiles: 5,
}
@Global()
@Module({
  imports: [
    // 全局加载环境变量配置
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? ['.env.production.local', '.env.production']
          : ['.env.local', '.env.development.local', '.env.development'],
      isGlobal: true,
      load: [getEnvConfig],
      // 会默认加载.env文件，即使配置了envFilePath
      //  ignoreEnvFile: true, // 明确禁止自动加载 .env 文件
      cache: true, //缓存，提升访问.env的性能
      validate,
    }),
    // 静态文件路径配置
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const staticFolder = configService.get('STATIC_DIR')
        // const uploadTemp = configService.get('UPLOAD_TEMP')
        const rootPath = path.join(__dirname, '../', staticFolder)
        // 可以配置多个静态目录
        return [
          {
            //放到global模块后路径加了2层
            rootPath,
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
    GlobalLoggerModule.forRootAsync({
      isGlobal: true,
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => {
        const isProduction = process.env.NODE_ENV === 'production'
        const logDir = configService.get('LOG_DIR') || 'log'
        const logLevel = configService.get('LOG_LEVEL') ?? 'debug'

        return {
          winstonConfig: {
            level: logLevel,
            transports: [
              new winston.transports.File({
                filename: path.join(logDir, 'error.log'),
                level: 'error',
                ...commonFileLoggerConfig,
              }),
              new winston.transports.File({
                filename: path.join(logDir, 'combined.log'),
                level: 'debug',
                ...commonFileLoggerConfig,
              }),
              new winston.transports.Console({
                format: winston.format.combine(
                  winston.format.colorize(),
                  winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                  }),
                  isProduction
                    ? winston.format.simple() // 生产环境使用简单格式
                    : customLogFormat,
                ),
              }),
            ],
            exceptionHandlers: [
              new winston.transports.File({
                filename: path.join(logDir, 'exceptions.log'),
                ...commonFileLoggerConfig,
              }),
            ],
            rejectionHandlers: [
              new winston.transports.File({
                filename: path.join(logDir, 'rejections.log'),
                ...commonFileLoggerConfig,
              }),
            ],
          },
        }
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    // RedisModule.forRoot(),
    RedisModule.forRootAsync({
      isGlobal: true,
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => {
        return {
          redisOptions: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }
      },
      inject: [ConfigService],
    }),
    EmailModule.forRootAsync({
      isGlobal: true,
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => {
        return {
          smtpOptions: {
            // host: configService.get('MAIL_HOST'),
            // port: configService.get('MAIL_PORT'),
            // secure: false,
            service: configService.get('MAIL_SERVICE_NAME'),
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASS'),
            },
          },
        }
      },
      inject: [ConfigService],
    }),
    MinioModule,
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
    {
      provide: APP_GUARD,
      useClass: CasbinAuthGuard,
    },
    // 所有GET请求加缓存
    // 有的GET请求执行的是操作，不能缓存
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
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
