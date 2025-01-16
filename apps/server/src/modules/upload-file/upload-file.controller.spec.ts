import { Test, TestingModule } from '@nestjs/testing'
import { MinioModule } from '../minio/minio.module'
import { MockGlobalModule } from '../mock-global/mock-global.module'
import { FileController } from './upload-file.controller'
import { UploadFileService } from './upload-file.service'

describe('FileController', () => {
  let controller: FileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockGlobalModule, MinioModule],
      controllers: [FileController],
      providers: [UploadFileService],
    }).compile()

    controller = module.get<FileController>(FileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
