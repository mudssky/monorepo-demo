import { Injectable, LoggerService, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

// const winston = require('winston')
// import { format, transports, createLogger, Logger } from 'winston'
import winston from 'winston'
// const winston = {
//   format,
//   transports,
//   createLogger,
// }

// 配置每个logger实例有不同的作用域，这样每个依赖注入的logger都是新的实例
// 这样可以给每个类中注入的logger有不同的上下文。(牺牲了一些内存，换取log定位的便利)
@Injectable({
  scope: Scope.TRANSIENT,
})
export class GlobalLoggerService implements LoggerService {
  private logger: winston.Logger
  constructor(private configService: ConfigService) {
    this.logger = winston.createLogger({
      level: this.configService.get('LOG_LEVEL') ?? 'debug',
      format: winston.format.combine(
        // winston.format.colorize(),

        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: 'log/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'log/combined.log',
        }),
      ],
    })
    // 开发环境添加控制台输出
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          //   format: winston.format.json(),
          //   format: winston.format.combine(
          // winston.format.colorize(),
          // winston.format.timestamp(),
          // winston.format.json(),
          // winston.format.prettyPrint(),
          //   ),
        }),
      )
    }
  }
  /**
   * 设置完后，当前logger实例都会输出
   * @param obj
   */
  setContext(obj: { label: string }) {
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
