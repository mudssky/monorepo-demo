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
  UploadResDto,
} from './dto/create-file.dto'
import { UploadFileService } from './upload-file.service'

// 这东西有bug，没法从req中获取body的其他参数
// export const storageOptions: MulterOptions = {
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       // cb(null, './uploads'); // 设置上传目录
//       console.log({ body: JSON.stringify(req.body), file })
//     },
//     filename: (req, file, cb) => {
//       const randomName = Array(32)
//         .fill(null)
//         .map(() => Math.round(Math.random() * 16).toString(16))
//         .join('')
//       cb(null, `${randomName}${path.extname(file.originalname)}`)
//     },
//   }),
// }

@ApiTags('文件上传')
@Controller('upload-file')
export class FileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  //   @UploadedFile(
  //   new ParseFilePipe({
  //     validators: [
  //       new MaxFileSizeValidator({ maxSize: 1000 }),
  //       new FileTypeValidator({ fileType: 'image/jpeg' }),
  //     ],
  //   }),
  // )
  // file: Express.Multer.File,

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

  // 上传多个文件

  @Post('uploadFiles')
  @UseInterceptors(FilesInterceptor('files', 500))
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

  // 上传任意字段名称键的所有字段
  // @Post('upload')
  // @UseInterceptors(AnyFilesInterceptor())
  // uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files);
  // }
  @Get()
  findAll() {
    return this.uploadFileService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadFileService.findOne(+id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.uploadFileService.update(+id, updateFileDto)
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadFileService.remove(+id)
  }
}
