import { Test, TestingModule } from '@nestjs/testing'
import { FileController } from './upload-file.controller'
import { UploadFileService } from './upload-file.service'

describe('FileController', () => {
  let controller: FileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [UploadFileService],
    }).compile()

    controller = module.get<FileController>(FileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
