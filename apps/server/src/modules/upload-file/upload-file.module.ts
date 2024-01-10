import { Module } from '@nestjs/common'
import { FileController } from './upload-file.controller'
import { UploadFileService } from './upload-file.service'

@Module({
  // imports: [
  //   MulterModule.register({
  //     dest: './upload',
  //   }),
  // ],
  controllers: [FileController],
  providers: [UploadFileService],
})
export class FileModule {}
