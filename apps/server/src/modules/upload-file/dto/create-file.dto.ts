import { $Enums, UploadFiles } from '#prisma'
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsOptional } from 'class-validator'

export class CreateFileDto implements Omit<UploadFiles, 'storageType'> {
  @ApiProperty()
  originalFilename: string
  id: string
  @ApiProperty()
  fileName: string
  @ApiProperty()
  filePath: string
  @ApiProperty()
  fileSize: number
  @ApiProperty({
    type: 'string',
    description: '文件标签，如果是头像上传则为AVATAR',
  })
  fileTag: $Enums.FileTag | null
  createdAt: Date
  updatedAt: Date
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File
  @ApiProperty({ type: 'string' })
  // 校验器
  @IsEnum(['NOTAG', 'AVATAR'], {
    message: 'invalid fileTag',
  })
  @IsOptional()
  fileTag: $Enums.FileTag = 'NOTAG'
}

export class FilesUploadDto extends PickType(FileUploadDto, ['fileTag']) {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files: Express.Multer.File[]
}

export const UploadResDtoPickList = [
  'filePath',
  'fileTag',
  'originalFilename',
  'fileName',
] as const

export class UploadResDto extends PartialType(
  PickType(CreateFileDto, UploadResDtoPickList),
) {
  @ApiProperty()
  url: string | null
}
export class UploadChunkDto {
  @ApiProperty()
  chunkFolderName: string
  @ApiProperty()
  @Transform(({ value }) => +value)
  @IsInt()
  chunkIndex: number
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File
}

export interface FileInfo {
  originalFileName: string
  fileSize: number
}
// 最后拼接完文件，也要按照文件上传的逻辑，有一个tag
export class MergeChunkDto {
  @ApiProperty({
    description: 'chunk的文件名，由chunkPrefix和chunkIndex组成',
  })
  chunkPrefix: string
  @ApiProperty({ description: 'chunk总数' })
  chunkCount: number
  fileInfo: FileInfo
  @IsOptional()
  @Transform(({ value }) => value ?? 'NOTAG')
  fileTag: $Enums.FileTag = 'NOTAG'
}
