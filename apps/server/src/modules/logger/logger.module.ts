import { Module } from '@nestjs/common'
import { GlobalLoggerService } from './logger.service'

@Module({
  providers: [GlobalLoggerService],
  exports: [GlobalLoggerService],
})
export class LoggerModule {}
