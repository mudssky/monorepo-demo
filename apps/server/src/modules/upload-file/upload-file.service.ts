import { Injectable } from '@nestjs/common'
import { CreateFileDto, FileUploadDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
@Injectable()
export class UploadFileService {
  private tempFilePath = 'temp'
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file'
  }

  /**
   * 接收到上传文件后保存逻辑
   * @param file
   */
  async saveFile(file: FileUploadDto) {
    //   if (await fs.promises.stat(this.tempFilePath))}{
    //     fs.promises.mkdir(this.tempFilePath)
    // }
    return true
  }
  findAll() {
    return `This action returns all file`
  }

  findOne(id: number) {
    return `This action returns a #${id} file`
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`
  }

  remove(id: number) {
    return `This action removes a #${id} file`
  }
}
