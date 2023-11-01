import { Injectable, LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

// const winston = require('winston')
import { format, transports, createLogger, Logger } from 'winston'
const winston = {
  format,
  transports,
  createLogger,
}

@Injectable()
export class GlobalLoggerService implements LoggerService {
  private logger: Logger
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

  error(message: string, trace: string) {
    this.logger.error(message, trace)
  }

  log(message: string) {
    this.logger.info(message)
  }

  info(message: string) {
    this.logger.info(message)
  }
  warn(message: string) {
    this.logger.warn(message)
  }
  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, optionalParams)
  }
}
