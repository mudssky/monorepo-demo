import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from '../auth/auth.module'
import { MockGlobalModule } from '../mock-global/mock-global.module'
import { PrismaService } from '../prisma/prisma.service'
import { SystemMonitorController } from './system-monitor.controller'
import { SystemMonitorGateway } from './system-monitor.gateway'
import { SystemMonitorService } from './system-monitor.service'

describe('SystemMonitorService', () => {
  let service: SystemMonitorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockGlobalModule, AuthModule],
      controllers: [SystemMonitorController],
      providers: [SystemMonitorGateway, SystemMonitorService, PrismaService],
    }).compile()

    service = module.get<SystemMonitorService>(SystemMonitorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
