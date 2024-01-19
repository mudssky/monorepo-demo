import { FileException } from '@/common/exceptions'
import { GlobalLoggerService } from '@/modules/logger/logger.service'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import {
  CreateFileDto,
  FileUploadDto,
  FilesUploadDto,
  UploadResDto,
  UploadResDtoPickList,
} from './dto/create-file.dto'

import { EnvironmentVariables } from '@/common/config/config'
import { pick } from '@mudssky/jsutils'
import { SharedService } from '../global/shared.service'

@Injectable()
export class UploadFileService {
  private imagePath

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: GlobalLoggerService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly sharedService: SharedService,
  ) {
    this.logger.setContext({ label: UploadFileService.name })
    this.imagePath = this.sharedService.getImagePath()
    if (!fs.existsSync(this.imagePath)) {
      fs.mkdirSync(this.imagePath, { recursive: true })
    }
  }
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file'
  }

  async createFile(file: FileUploadDto) {
    const fileId = uuidv4()
    const tmpFileName = `${fileId}${path.extname(file.file.originalname)}`
    const folderPath = path.join(this.imagePath, file.fileTag)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }
    const tmpPath = path.join(folderPath, tmpFileName)
    const shortPath = `${file.fileTag}/${tmpFileName}`
    await fs.promises.writeFile(tmpPath, file.file.buffer)
    return {
      tmpPath,
      tmpFileName,
      shortPath,
      file,
    }
  }
  /**
   * 接收到上传文件后保存逻辑
   * @param file
   */
  async saveFile(file: FileUploadDto) {
    try {
      const { tmpFileName, shortPath } = await this.createFile(file)
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
      return {
        ...pick(res, [...UploadResDtoPickList]),
        url: this.sharedService.getFullImageUrl(res.filePath),
      }
    } catch (e) {
      this.logger.error(e)
      throw new FileException(e.message)
    }
  }

  async saveFiles(file: FilesUploadDto) {
    const fileList: FileUploadDto[] = []

    try {
      for (const fileItem of file.files) {
        fileList.push({
          file: fileItem,
          fileTag: file.fileTag,
        })
      }
      const uploadSuccessList: UploadResDto[] = []
      // 直接调用上传单个文件的方法是一样的，如果中途有问题就会变成没用的临时文件。
      for (const item of fileList) {
        const res = await this.saveFile(item)
        uploadSuccessList.push(res)
      }
      return uploadSuccessList
    } catch (e) {
      throw new FileException(e.message)
    }
  }
  findAll() {
    return `This action returns all file`
  }

  findOne(id: number) {
    return `This action returns a #${id} file`
  }

  remove(id: number) {
    return `This action removes a #${id} file`
  }
}
