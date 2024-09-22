import {
  Inject,
  Injectable,
  LoggerService,
  LogLevel,
  Scope,
} from '@nestjs/common'
import winston from 'winston'
import {
  GlobolLoggerModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from './cofig.module-definition'

// 配置每个logger实例有不同的作用域，这样每个依赖注入的logger都是新的实例
// 这样可以给每个类中注入的logger有不同的上下文。(牺牲了一些内存，换取log定位的便利)
@Injectable({
  scope: Scope.TRANSIENT,
})
/**
 * @deprecated
 * 没有实现nestjs全部的logger接口，TODO
 */
export class GlobalLoggerService implements LoggerService {
  private logger: winston.Logger
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options?: GlobolLoggerModuleOptions,
  ) {
    this.logger = winston.createLogger({
      ...options?.winstonConfig,
    })
  }
  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, optionalParams)
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams)
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams)
  }
  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, optionalParams)
  }
  verbose(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, optionalParams)
  }
  fatal(message: any, ...optionalParams: any[]) {
    this.logger.error(message, { level: 'fatal' }, optionalParams)
  }
  setLogLevels(levels: LogLevel[]) {
    if (levels && levels.length > 0) {
      this.logger.level = levels[0] // 这里可以根据需要更改逻辑
    }
  }
}
