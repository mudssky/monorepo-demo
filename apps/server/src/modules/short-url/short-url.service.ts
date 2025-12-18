import { generateBase62Code } from '@mudssky/jsutils'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ShortUrl } from '#prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ShortUrlService {
  constructor(private readonly prismaService: PrismaService) {}

  //   @Cron(CronExpression.EVERY_5_SECONDS)
  /**
   * 改为while循环,防止递归栈溢出
   * @returns
   */
  async generateCode() {
    const res: ShortUrl[] = []
    while (res.length < 1) {
      const str = generateBase62Code(6)
      const uniqueCode = await this.prismaService.shortUrl.findUnique({
        where: {
          code: str,
        },
      })
      if (!uniqueCode) {
        const code = await this.prismaService.shortUrl.create({
          data: {
            code: str,
          },
        })
        res.push(code)
      }
    }
    return res?.[0]
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async bactchGenerateCode() {
    const shortUrlCount = await this.prismaService.shortUrl.count()
    // 数量达到侯就不需要继续生成了
    if (shortUrlCount > 10000) {
      return
    }
    for (let i = 0; i < 10000; i++) {
      await this.generateCode()
    }
  }

  async generateShortUrl(longUrl: string) {
    let uniqueCode = await this.prismaService.shortUrl.findFirst({
      where: {
        status: 'DISABLE',
      },
    })

    if (!uniqueCode) {
      uniqueCode = await this.generateCode()
    }
    await this.prismaService.shortUrl.update({
      where: {
        code: uniqueCode?.code,
      },
      data: {
        longUrl,
        status: 'ENABLE',
      },
    })
    return uniqueCode?.code
  }

  async getLongUrl(code: string) {
    const shortUrlItem = await this.prismaService.shortUrl.findUnique({
      where: {
        code,
      },
    })
    if (!shortUrlItem) {
      return null
    }
    return shortUrlItem.longUrl
  }
}
