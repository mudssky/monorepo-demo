import { isEmpty } from '@mudssky/jsutils'
import { Inject, Injectable, LoggerService, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import winston, { LoggerOptions } from 'winston'
import { commonFileFormat, customLogFormat } from './logger.format'
import { GLOBAL_LOGGER_OPTIONS } from './logger.module'

// 配置每个logger实例有不同的作用域，这样每个依赖注入的logger都是新的实例
// 这样可以给每个类中注入的logger有不同的上下文。(牺牲了一些内存，换取log定位的便利)
@Injectable({
  scope: Scope.TRANSIENT,
})
export class GlobalLoggerService implements LoggerService {
  private logger: winston.Logger
  constructor(
    private configService: ConfigService,
    @Inject(GLOBAL_LOGGER_OPTIONS) private options?: LoggerOptions,
  ) {
    // options参数为{}或undefined
    if (isEmpty(options)) {
      this.logger = winston.createLogger({
        level: this.configService.get('LOG_LEVEL') ?? 'debug',
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
      })
    } else {
      // 配置不为空时，用配置覆盖
      this.logger = winston.createLogger(options)
    }
  }
  /**
   * 设置完后，当前logger实例都会输出
   * @param obj
   */
  setContext(obj: { label: string } = { label: 'undefined' }) {
    this.logger.defaultMeta = {
      ...obj,
    }
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams)
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, optionalParams)
  }

  info(message: any, ...optionalParams: any[]) {
    this.logger.info(message, optionalParams)
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, optionalParams)
  }
  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, optionalParams)
  }
}
