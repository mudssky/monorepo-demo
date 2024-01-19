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
  UploadResDtoPickList,
} from './dto/create-file.dto'

import { EnvironmentVariables } from '@/common/config/config'
import { pick } from '@mudssky/jsutils'

@Injectable()
export class UploadFileService {
  private imagePath

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: GlobalLoggerService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.logger.setContext({ label: UploadFileService.name })
    this.imagePath = `${this.configService.get(
      'STATIC_DIR',
    )}/${this.configService.get('PIC_DIR')}`
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
      return pick(res, [...UploadResDtoPickList])
    } catch (e) {
      this.logger.error(e)
      throw new FileException('file uploaded failed')
    }
  }

  async saveFiles(file: FilesUploadDto) {
    const fileList: {
      tmpPath: string
      tmpFileName: string
      shortPath: string
      file: FileUploadDto
    }[] = []

    try {
      for (const fileItem of file.files) {
        const res = await this.createFile({
          file: fileItem,
          fileTag: file.fileTag,
        })
        fileList.push(res)
      }
      const addList = fileList.map((item) => {
        const curFileDto = item.file
        return {
          fileName: item.tmpFileName,
          originalFilename: curFileDto.file.originalname,
          filePath: item.shortPath,
          fileSize: curFileDto.file.size,
          fileTag: curFileDto.fileTag,
        }
      })
      const res = await Promise.all(
        addList.map(async (item) => {
          // create方法会返回插入的信息，兼容性也更强
          const res = await this.prismaService.uploadFiles.create({
            data: item,
          })
          return pick(res, [...UploadResDtoPickList])
        }),
      )
      console.log({ res })

      return res
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
