import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from '../auth/auth.module'
import { MockGlobalModule } from '../mock-global/mock-global.module'
import { SystemMonitorController } from './system-monitor.controller'
import { SystemMonitorGateway } from './system-monitor.gateway'
import { SystemMonitorService } from './system-monitor.service'

describe('SystemMonitorGateway', () => {
  let gateway: SystemMonitorGateway

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockGlobalModule, AuthModule],
      controllers: [SystemMonitorController],
      providers: [SystemMonitorGateway, SystemMonitorService],
    }).compile()

    gateway = module.get<SystemMonitorGateway>(SystemMonitorGateway)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })
})
