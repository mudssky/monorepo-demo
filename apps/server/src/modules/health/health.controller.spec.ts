import { HttpModule } from '@nestjs/axios'
import { TerminusModule } from '@nestjs/terminus'
import { Test, TestingModule } from '@nestjs/testing'
import { TerminusLogger } from '../logger/terminus-logger.service'
import { MockGlobalModule } from '../mock-global/mock-global.module'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  let controller: HealthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MockGlobalModule,
        TerminusModule.forRoot({
          // 自定义logger，和全局logger继承
          logger: TerminusLogger,
        }),
        HttpModule,
      ],
      controllers: [HealthController],
      // providers: [HealthCheckService],
    }).compile()

    controller = module.get<HealthController>(HealthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
