import { Module } from '@nestjs/common'
import { FileController } from './upload-file.controller'
import { UploadFileService } from './upload-file.service'

@Module({
  controllers: [FileController],
  providers: [UploadFileService],
})
export class FileModule {}
