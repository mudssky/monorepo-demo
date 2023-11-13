import { Module } from '@nestjs/common'
import { SystemMonitorGateway } from './system-monitor.gateway'
import { AuthModule } from '@/modules/auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [SystemMonitorGateway],
})
export class SystemMonitorGatewayModule {}
