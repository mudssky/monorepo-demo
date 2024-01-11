import { FileException } from '@/common/exceptions'
import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { CreateFileDto, FileUploadDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
@Injectable()
export class UploadFileService {
  private tempFilePath = 'uploadTemp'

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: GlobalLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext({ label: UploadFileService.name })
    this.tempFilePath = this.configService.get('uploadTempPath') ?? 'uploadTemp'
    if (!fs.existsSync(this.tempFilePath)) {
      fs.mkdirSync(this.tempFilePath)
    }
  }
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
    const fileId = uuidv4()
    const tmpFileName = `${fileId}${path.extname(file.file.originalname)}`

    // console.log({ file })

    const folderPath = path.join(this.tempFilePath, file.fileTag)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    const tmpPath = path.join(folderPath, tmpFileName)
    const shortPath = `${file.fileTag}/${tmpFileName}`

    try {
      await fs.promises.writeFile(tmpPath, file.file.buffer)

      const res = await this.prismaService.uploadFiles.create({
        data: {
          fileName: tmpFileName,
          originalFilename: file.file.originalname,
          filePath: shortPath,
          fileSize: file.file.size,
          fileTag: file.fileTag,
        },
      })
      this.logger.debug({
        type: 'db create',
        data: res,
      })
    } catch (e) {
      this.logger.error(e)
      throw new FileException('file uploaded failed')
    }

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
