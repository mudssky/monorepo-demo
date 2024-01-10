import { ApiProperty } from '@nestjs/swagger'
import { $Enums, FileTag, UploadFiles } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'

export class CreateFileDto implements UploadFiles {
  id: number
  @ApiProperty()
  fileName: string
  @ApiProperty()
  filePath: string
  @ApiProperty()
  fileSize: number
  @ApiProperty({ description: '文件标签，如果是头像上传则为AVATAR' })
  fileTag: $Enums.FileTag | null
  createdAt: Date
  updatedAt: Date
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any
  @ApiProperty({ type: 'string' })
  // 校验器
  @IsEnum(FileTag, {
    message: 'invalid fileTag',
  })
  @IsOptional()
  fileTag: $Enums.FileTag = 'NOTAG'
}

export class FilesUploadDto {
  @ApiProperty({ type: [String], format: 'binary' })
  files: any[]
}
