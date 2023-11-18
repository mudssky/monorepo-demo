import { Expose, Transform, plainToInstance } from 'class-transformer'
import {
  IsEnum,
  IsIP,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator'
import { IsPortNum } from '../decorators/validators'
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

  //-----------------------日志相关配置------------------
  @Expose()
  @IsEnum(LogLevel)
  LOG_LEVEL: LogLevel = LogLevel.Debug

  // -----------------------缓存和redis配置-------------
  @Expose()
  @IsEnum(CacheType)
  CACHE_TYPE: CacheType = CacheType.Memory
  @Expose()
  @IsIP('4')
  REDIS_HOST = '127.0.0.1'

  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @Expose()
  @IsPortNum()
  REDIS_PORT = 6379

  // ----------------------------jwt相关配置---------------
  @Expose()
  JWT_SECRET
  @IsNumberString()
  @Expose()
  JWT_EXPIRATION

  //--------------------------- 路由相关配置---------------------
  @Expose()
  @IsString()
  GLOBAL_PREFIX = '/api'
}

export type GlobalEnvConfigKey = keyof EnvironmentVariables

const getEnvConfig = () => ({
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

export default getEnvConfig

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
    throw new Error(errors.toString())
  }
  return validatedConfig
}
