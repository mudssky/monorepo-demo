import { EnvironmentVariables } from '@/common/config/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GlobalLoggerService } from '../logger/logger.service'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SharedService {
  private imagePath: string
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: GlobalLoggerService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  /**
   * 从配置文件拼接获取图片路径
   * @returns
   */
  getImagePath() {
    this.imagePath = `${this.configService.get(
      'STATIC_DIR',
    )}/${this.configService.get('PIC_DIR')}`
    return this.imagePath
  }

  /**
   * 根据短路径，获取图片全路径
   * @param shortUrl
   * @returns
   */
  getFullImageUrl(shortUrl?: string) {
    if ((shortUrl ?? '').trim() === '') {
      // 因为undefined 后端不会返回字段，所以后端统一返回null了
      return null
    }
    return `/${this.imagePath}/${shortUrl}`
  }
}
