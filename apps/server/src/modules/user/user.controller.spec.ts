import { Test, TestingModule } from '@nestjs/testing'
import { MockGlobalModule } from '../mock-global/mock-global.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockGlobalModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
