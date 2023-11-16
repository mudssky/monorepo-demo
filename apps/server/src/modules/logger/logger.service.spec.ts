import config from '@/common/config/config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { validate } from 'class-validator'
import { GlobalLoggerService } from './logger.service'

describe('LoggerService', () => {
  let service: GlobalLoggerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.development'],
          isGlobal: true,
          load: [config],
          cache: true, //缓存，提升访问.env的性能
          validate,
        }),
      ],
      providers: [GlobalLoggerService, ConfigService],
    }).compile()

    service = await module.resolve<GlobalLoggerService>(GlobalLoggerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
