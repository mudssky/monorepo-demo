import { FileException } from '@/common/exceptions'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { GlobalLoggerService } from '@lib'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import {
  FileUploadDto,
  FilesUploadDto,
  MergeChunkDto,
  UploadChunkDto,
  UploadResDto,
  UploadResDtoPickList,
} from './dto/create-file.dto'

import { EnvironmentVariables } from '@/common/config/config'
import { pick, range } from '@mudssky/jsutils'
import { FileTag } from '@prisma/client'
import { SharedService } from '../global/shared.service'

@Injectable()
export class UploadFileService {
  private imagePath
  private tempPath: string
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: GlobalLoggerService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly sharedService: SharedService,
  ) {
    this.imagePath = this.sharedService.getImagePath()
    this.tempPath = this.sharedService.getTempPath()
    // 下面是异步操作
    this.sharedService.ensureDirectoryExists(this.imagePath)
    this.sharedService.ensureDirectoryExists(this.tempPath)
  }

  async createFilePath(options: {
    originalFileName: string
    fileTag: FileTag
  }) {
    const { originalFileName, fileTag } = options
    const fileId = uuidv4()
    const finalFileName = `${fileId}${path.extname(originalFileName)}`
    const folderPath = path.join(this.imagePath, fileTag)
    this.sharedService.ensureDirectoryExists(folderPath)
    const finalFilePath = path.join(folderPath, finalFileName)
    const shortPath = `${fileTag}/${finalFileName}`

    return {
      finalFilePath,
      finalFileName,
      shortPath,
    }
  }

  async createFile(file: FileUploadDto) {
    const { finalFilePath, finalFileName, shortPath } =
      await this.createFilePath({
        originalFileName: file.file.originalname,
        fileTag: file.fileTag,
      })
    await fs.promises.writeFile(finalFilePath, file.file.buffer)
    return {
      finalFilePath,
      finalFileName,
      shortPath,
      file,
    }
  }

  joinChunkName(chunkDto: Omit<UploadChunkDto, 'file'>) {
    return `${chunkDto.chunkFolderName}_${chunkDto.chunkIndex}`
  }
  async saveChunk(filesUploadDto: UploadChunkDto) {
    const chunkFolder = path.join(this.tempPath, filesUploadDto.chunkFolderName)
    this.sharedService.ensureDirectoryExists(chunkFolder)
    const chunkName = this.joinChunkName(filesUploadDto)
    const chunkPath = path.join(chunkFolder, chunkName)
    await fs.promises.writeFile(chunkPath, filesUploadDto.file.buffer)
    return true
  }

  async mergeChunks(mergeChunkDto: MergeChunkDto) {
    try {
      const { finalFilePath, finalFileName, shortPath } =
        await this.createFilePath({
          originalFileName: mergeChunkDto.fileInfo.originalFileName,
          fileTag: mergeChunkDto.fileTag,
        })
      const writeStream = fs.createWriteStream(finalFilePath)
      const chunkPaths = range(mergeChunkDto.chunkCount).map((chunkIndex) => {
        const chunkName = this.joinChunkName({
          chunkFolderName: mergeChunkDto.chunkPrefix,
          chunkIndex: chunkIndex,
        })
        const chunkPath = path.join(
          this.tempPath,
          mergeChunkDto.chunkPrefix,
          chunkName,
        )
        return chunkPath
      })
      for (const chunkPath of chunkPaths) {
        const data = await fs.promises.readFile(chunkPath)
        writeStream.write(data)
      }
      writeStream.end()

      // 直接删除分片的目录了
      await fs.promises.rm(
        path.join(this.tempPath, mergeChunkDto.chunkPrefix),
        { recursive: true },
      )

      const res = await this.prismaService.uploadFiles.create({
        data: {
          fileName: finalFileName,
          originalFilename: mergeChunkDto.fileInfo.originalFileName,
          filePath: shortPath,
          fileSize: mergeChunkDto.fileInfo.fileSize,
          fileTag: mergeChunkDto.fileTag,
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
  /**
   * 接收到上传文件后保存逻辑
   * @param file
   */
  async saveFile(file: FileUploadDto) {
    try {
      const { finalFileName, shortPath } = await this.createFile(file)
      const res = await this.prismaService.uploadFiles.create({
        data: {
          fileName: finalFileName,
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
}
