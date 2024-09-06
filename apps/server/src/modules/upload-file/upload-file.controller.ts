import { MB } from '@/common/constant'
import { IMAGE_EXTENSION_PATTERN } from '@/common/constant/regex'
import { ApiCustomResponse } from '@/common/decorators/swagger'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import {
  FileUploadDto,
  FilesUploadDto,
  MergeChunkDto,
  UploadChunkDto,
  UploadResDto,
} from './dto/create-file.dto'
import { UploadFileService } from './upload-file.service'

@ApiTags('文件上传')
@Controller('upload-file')
export class FileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  // multer支持处理multipart/form-data 格式的文件上传
  @Post('uploadSingleFile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传单个文件',
    type: FileUploadDto,
  })
  @ApiCustomResponse({
    type: UploadResDto,
    description: '上传文件响应',
  })
  async uploadFile(
    @Body() fileUploadDto: FileUploadDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: IMAGE_EXTENSION_PATTERN,
        })
        .addMaxSizeValidator({
          maxSize: 10 * MB,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    // console.log({ file })
    fileUploadDto.file = file
    return await this.uploadFileService.saveFile(fileUploadDto)
  }

  @Post('uploadFiles')
  @UseInterceptors(FilesInterceptor('files', 500))

  // 可以指定多个字段,并且指定每个字段的最大文件数
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'avatar', maxCount: 1 },
  //     { name: 'background', maxCount: 1 },
  //   ]),
  // )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传多个文件',
    type: FilesUploadDto,
  })
  @ApiCustomResponse({
    type: [UploadResDto],
    description: '上传文件响应',
  })
  async uploadFiles(
    @Body() filesUploadDto: FilesUploadDto,
    @UploadedFiles() // 指定字段名
    files: Express.Multer.File[],
  ) {
    filesUploadDto.files = files
    return await this.uploadFileService.saveFiles(filesUploadDto)
  }

  /**
   * 分片上传的方法上传大文件
   * @param uploadChunkDto
   * @param files
   * @returns
   */
  @Post('uploadChunk')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传文件切片',
    type: UploadChunkDto,
  })
  @ApiCustomResponse({
    type: Boolean,
    description: '上传文件切片响应',
  })
  async uploadChunk(
    @Body() uploadChunkDto: UploadChunkDto,
    @UploadedFile() // 指定字段名
    file: Express.Multer.File,
  ) {
    uploadChunkDto.file = file
    // uploadChunkDto.chunkIndex = parseInt(
    //   uploadChunkDto.chunkIndex as unknown as string,
    // )
    return await this.uploadFileService.saveChunk(uploadChunkDto)
  }

  @Post('mergeChunks')
  async mergeChunks(@Body() mergeChunkDto: MergeChunkDto) {
    return await this.uploadFileService.mergeChunks(mergeChunkDto)
  }
  // 上传任意字段名称键的所有字段
  // @Post('upload')
  // @UseInterceptors(AnyFilesInterceptor())
  // uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files);
  // }
}
