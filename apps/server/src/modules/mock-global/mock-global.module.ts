import * as path from 'node:path'
import {
  commonFileFormat,
  customLogFormat,
  GlobalLoggerModule,
} from '@monorepo-demo/logger'
import { RedisModule } from '@monorepo-demo/redis'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import winston from 'winston'
import {
  EnvironmentVariables,
  getEnvConfig,
  validate,
} from '@/common/config/config'
import { ResponseInterceptor } from '@/common/interceptors/response/response.interceptor'
import { GlobalValidationPipe } from '@/common/pipes/global-validation/global-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard'
import { CustomCacheModule } from '../custom-cache/custom-cache.module'
import { EmailModule } from '../email/email.module'
import { SharedService } from '../global/shared.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [
    // 全局加载环境变量配置
    ConfigModule.forRoot({
      envFilePath: [path.resolve(__dirname, '../../../.env.development')],
      isGlobal: true,
      load: [getEnvConfig],
      cache: true, //缓存，提升访问.env的性能
      validate,
    }),
    CustomCacheModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    GlobalLoggerModule.forRootAsync({
      isGlobal: true,
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => {
        return {
          winstonConfig: {
            level: configService.get('LOG_LEVEL') ?? 'debug',
            transports: [
              new winston.transports.File({
                filename: 'log/error.log',
                level: 'error',
                format: commonFileFormat,
              }),
              new winston.transports.File({
                filename: 'log/combined.log',
                format: commonFileFormat,
              }),
              // 开发环境添加控制台输出
              ...(process.env.NODE_ENV !== 'production'
                ? [
                    new winston.transports.Console({
                      format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp({
                          format: 'YYYY-MM-DD HH:mm:ss',
                        }),
                        customLogFormat,
                      ),
                    }),
                  ]
                : []),
            ],
          },
        }
      },
      inject: [ConfigService],
    }),
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
    SharedService,
  ],
  exports: [SharedService],
})
export class MockGlobalModule {}
