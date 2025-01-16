import { EnvironmentVariables } from '@/common/config'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Minio from 'minio'
import { MinioService } from './minio.service'

@Global()
@Module({
  providers: [
    MinioService,
    {
      provide: 'MINIO_CLIENT',
      async useFactory(configService: ConfigService<EnvironmentVariables>) {
        const logger = new Logger(MinioModule.name)
        try {
          const client = new Minio.Client({
            endPoint: configService.get('MINIO_ENDPOINT') ?? 'localhost',
            port: configService.get('MINIO_PORT') ?? 9000,
            useSSL: false,
            accessKey: configService.get('MINIO_ACCESS_KEY') ?? '',
            secretKey: configService.get('MINIO_SECRET_KEY') ?? '',
          })
          return client
        } catch (error) {
          logger.error(error)
          return {}
        }
      },

      inject: [ConfigService],
    },
  ],
  exports: [MinioService],
})
export class MinioModule {}
