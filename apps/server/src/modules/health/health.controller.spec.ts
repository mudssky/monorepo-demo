import { TestBed } from '@automock/jest'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  let controller: HealthController
  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [
    //     MockGlobalModule,
    //     TerminusModule.forRoot({
    //       // 自定义logger，和全局logger继承
    //       logger: TerminusLogger,
    //     }),
    //     HttpModule,
    //   ],
    //   controllers: [HealthController],
    //   // providers: [HealthCheckService],
    // }).compile()

    // controller = module.get<HealthController>(HealthController)

    const { unit } = TestBed.create(HealthController).compile()
    controller = unit
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
