import { EnvironmentVariables } from '@/common/config'
import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import * as Minio from 'minio'
import { MinioService } from './minio.service'

@ApiTags('Minio')
@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private minioClient: Minio.Client
  constructor(
    private readonly minioService: MinioService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  @ApiOperation({ summary: '上传文件前申请授权' })
  @Get('presignedPutUrl')
  presignedPutUrl(@Query('fileName') fileName: string) {
    return this.minioClient.presignedPutObject(
      this.configService.get('MINIO_PROJECT_BUCKET') ?? '',
      fileName,
      3600,
    )
  }
}
