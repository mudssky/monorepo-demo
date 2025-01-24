import { parseBoolString, splitAndTrim } from '@/common/utils'
import { ConfigService } from '@nestjs/config'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator'
import { IsPortNum, IsValidHost } from '../decorators/validators'
enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}
enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}
enum CacheType {
  Redis = 'redis',
  Memory = 'memory',
}

export class EnvironmentVariables {
  // @IsUrl()
  @Expose()
  DATABASE_URL =
    'postgresql://postgres:123456@localhost:5432/nestAdmin?schema=public'

  @Expose()
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development

  @Expose()
  @IsPortNum()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  PORT = 33101

  @Expose()
  /* 初始添加的管理员账号密码 */
  DEFAUT_ADMIN_PASSWORD

  @Expose()
  @Transform(({ value }) => parseBoolString(value, true), { toClassOnly: true })
  @IsBoolean()
  ENABLE_CHECK_CAPTCHA = true

  // #-----------------------oss相关配置---------------

  @Expose()
  @IsValidHost()
  MINIO_ENDPOINT = 'localhost'
  @Expose()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsPortNum()
  MINIO_PORT = 9000
  @Expose()
  MINIO_ACCESS_KEY
  @Expose()
  MINIO_SECRET_KEY
  @Expose()
  @IsNotEmpty()
  MINIO_PROJECT_BUCKET
  //-----------------------日志相关配置------------------
  @Expose()
  @IsEnum(LogLevel)
  LOG_LEVEL: LogLevel = LogLevel.Debug

  // -----------------------缓存和redis配置-------------
  @Expose()
  @IsEnum(CacheType)
  CACHE_TYPE: CacheType = CacheType.Memory
  @Expose()
  @IsValidHost()
  REDIS_HOST = '127.0.0.1'

  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @Expose()
  @IsPortNum()
  REDIS_PORT = 6379

  // #-----------------------第三方认证相关配置---------------------------
  @Expose()
  @IsString()
  GITHUB_OAUTH_CLIENT_ID: string
  @Expose()
  @IsString()
  GITHUB_OAUTH_CLIENT_SECRET: string

  @Expose()
  @IsString()
  GITHUB_OAUTH_CALLBACK_URL: string
  @Expose()
  @Transform(({ value }) => splitAndTrim(value), { toClassOnly: true })
  GITHUB_OAUTH_SCOPE: string[]

  @Expose()
  @IsString()
  GOOGLE_OAUTH_CLIENT_ID

  @Expose()
  @IsString()
  GOOGLE_OAUTH_CLIENT_SECRET

  @Expose()
  @IsString()
  GOOGLE_OAUTH_CALLBACK_URL
  @Expose()
  @Transform(({ value }) => splitAndTrim(value), { toClassOnly: true })
  GOOGLE_OAUTH_SCOPE

  // ----------------------------jwt相关配置---------------
  @Expose()
  JWT_SECRET: string
  @IsNumberString()
  @Expose()
  JWT_EXPIRATION: string

  //--------------------------- 路由相关配置---------------------
  @Expose()
  @IsString()
  GLOBAL_PREFIX = '/api'

  @Expose()
  @IsString()
  STATIC_DIR: string

  @Expose()
  @IsString()
  PIC_DIR: string
  @Expose()
  @IsString()
  UPLOAD_TEMP: string
  // #--------------------------- 权限相关配置------------------------------------------
  @Expose()
  @IsString()
  CASBIN_MODAL_PATH
  // #--------------------------- 邮箱相关配置------------------------------------------
  @Expose()
  @IsString()
  MAIL_SERVICE_NAME
  // @Expose()
  // @IsString()
  // MAIL_HOST
  // @Expose()
  // @IsString()
  // MAIL_PORT
  @Expose()
  @IsEmail()
  MAIL_USER
  @Expose()
  @IsString()
  MAIL_PASS
}

export type GlobalEnvConfigKey = keyof EnvironmentVariables

export type EnvironmentVariablesInterface = {
  [K in keyof EnvironmentVariables]: EnvironmentVariables[K]
}

/**
 * 扩展ConfigService的类型定义，添加类型提示
 */
export interface TypedConfigService<
  T extends Record<string, any>,
  WasValidated extends boolean = false,
> extends ConfigService<T, WasValidated> {
  get<K extends keyof T>(key: K): T[K]
  // 使用函数类型重载，确保之前手动生命类型的功能也正确
  get<RETURN = any>(key: keyof T): RETURN
}

/**
 * 传入class类型，创建全局配置的推导类型
 */
export type GlobalConfigService<WasValidated extends boolean = false> =
  TypedConfigService<EnvironmentVariablesInterface, WasValidated>

export const getEnvConfig = () => ({
  port: parseInt(process.env.PORT ?? '33101', 10) ?? 33101,
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
  logger: {
    level: process.env.LOGGER_LEVEL ?? 'debug',
  },
  cache: {
    cacheType: process.env.CACHE_TYPE ?? 'memory',
  },
})
export type GlobalConfig = ReturnType<typeof getEnvConfig>

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    // enableImplicitConversion: false, //隐式类型转换关掉
    enableImplicitConversion: true,
    excludeExtraneousValues: true, //排除无关的属性，需要在每个需要转换类属性设置Expose或者Exclude
    exposeDefaultValues: true,
  })

  const errors = validateSync(validatedConfig, { skipMissingProperties: false })
  if (errors.length > 0) {
    console.log({ errors })
    console.log({ validatedConfig })
    throw new Error(errors.toString())
  }
  return validatedConfig
}
