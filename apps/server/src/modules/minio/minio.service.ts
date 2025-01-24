import { EnvironmentVariables } from '@/common/config'
import { BaseException } from '@/common/exceptions'
import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Minio from 'minio'
import { PresignedUrlParamDto } from './dto/minio.dto'

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name)
  private readonly minioProjectBucket: string
  @Inject('MINIO_CLIENT')
  private minioClient: Minio.Client

  get isMinioConnectSuccess(): boolean {
    return 'bucketExists' in (this.minioClient || {})
  }
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.minioProjectBucket =
      this.configService.get('MINIO_PROJECT_BUCKET') ?? ''
  }
  async onModuleInit() {
    // 校验应该在配置加载的部分执行
    // if (!this.minioProjectBucket) {
    //   this.logger.error('MINIO_PROJECT_BUCKET is not set')
    //   return
    // }
    if (!this.isMinioConnectSuccess) {
      return
    }
    // bucket不存在则创建
    const isBucketExist = await this.minioClient.bucketExists(
      this.configService.get('MINIO_PROJECT_BUCKET') ?? '',
    )
    if (!isBucketExist) {
      await this.minioClient.makeBucket(
        this.minioProjectBucket,
        'defaultRegion',
      )
    }
  }

  async presignedPutUrl(presignedUrlParamDto: PresignedUrlParamDto) {
    if (!this.isMinioConnectSuccess) {
      throw new BaseException('Minio is not connect success')
    }
    try {
      const res = await this.minioClient.presignedPutObject(
        this.minioProjectBucket,
        presignedUrlParamDto.objectName,
        presignedUrlParamDto.expires,
        // DAY,
        // 默认值是7天，这里设置一天应该够用了。
      )
      return res
    } catch (e) {
      throw new BaseException(e.message, HttpStatus.BAD_REQUEST, {
        cause: e,
      })
    }
  }
}
