import { Test, TestingModule } from '@nestjs/testing'
import { MockGlobalModule } from '../mock-global/mock-global.module'
import { UploadFileService } from './upload-file.service'

describe('FileService', () => {
  let service: UploadFileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockGlobalModule],
      providers: [UploadFileService],
    }).compile()

    service = module.get<UploadFileService>(UploadFileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
