import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { TerminusLogger } from '../logger/terminus-logger.service'
import { PrismaModule } from '../prisma/prisma.module'
import { HealthController } from './health.controller'
@Module({
  imports: [
    TerminusModule.forRoot({
      // 自定义logger，和全局logger继承
      logger: TerminusLogger,
    }),
    HttpModule,
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
