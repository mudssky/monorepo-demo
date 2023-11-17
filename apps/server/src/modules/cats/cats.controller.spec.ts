import { Test, TestingModule } from '@nestjs/testing'
import { CatsController } from './cats.controller'
import { CatsDatabaseService, CatsService } from './cats.service'

describe('CatsController', () => {
  let controller: CatsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService, CatsDatabaseService],
    }).compile()

    controller = module.get<CatsController>(CatsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
