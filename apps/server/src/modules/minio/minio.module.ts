import { EnvironmentVariables } from '@/common/config'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Minio from 'minio'
import { MinioController } from './minio.controller'
import { MinioService } from './minio.service'

@Global()
@Module({
  controllers: [MinioController],
  providers: [
    MinioService,
    {
      provide: 'MINIO_CLIENT',
      async useFactory(configService: ConfigService<EnvironmentVariables>) {
        const client = new Minio.Client({
          endPoint: configService.get('MINIO_ENDPOINT') ?? 'localhost',
          port: configService.get('MINIO_PORT') ?? 9000,
          useSSL: false,
          accessKey: configService.get('MINIO_ACCESS_KEY') ?? '',
          secretKey: configService.get('MINIO_SECRET_KEY') ?? '',
        })
        return client
      },

      inject: [ConfigService],
    },
  ],
})
export class MinioModule {}
