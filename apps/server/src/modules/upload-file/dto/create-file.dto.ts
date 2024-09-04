import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import { $Enums, FileTag, UploadFiles } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'

export class CreateFileDto implements UploadFiles {
  @ApiProperty()
  originalFilename: string
  id: number
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
  @IsEnum(FileTag, {
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
