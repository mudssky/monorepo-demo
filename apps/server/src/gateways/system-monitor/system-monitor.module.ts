import { Module } from '@nestjs/common'
import { SystemMonitorGateway } from './system-monitor.gateway'

@Module({
  providers: [SystemMonitorGateway],
})
export class SystemMonitorGatewayModule {}
