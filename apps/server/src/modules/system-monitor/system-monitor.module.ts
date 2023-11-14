import { Module } from '@nestjs/common'
import { SystemMonitorGateway } from './system-monitor.gateway'
import { AuthModule } from '@/modules/auth/auth.module'
import { SystemMonitorController } from './system-monitor.controller'
import { SystemMonitorService } from './system-monitor.service'

@Module({
  imports: [AuthModule],
  providers: [SystemMonitorGateway, SystemMonitorService],
  controllers: [SystemMonitorController],
})
export class SystemMonitorModule {}
