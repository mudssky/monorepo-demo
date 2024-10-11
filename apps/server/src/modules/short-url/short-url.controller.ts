import { BaseException } from '@/common/exceptions'
import { Controller, Get, Param, Query, Redirect } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ShortUrlService } from './short-url.service'

@ApiTags('短链服务')
@Controller('short-url')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Get('/generate')
  async generateShortUrl(@Query('url') url: string) {
    return this.shortUrlService.generateShortUrl(url)
  }

  @Get(':code')
  @Redirect()
  async redirectShortUrl(@Param('code') code: string) {
    const longUrl = await this.shortUrlService.getLongUrl(code)
    if (!longUrl) {
      throw new BaseException('Invalid short url')
    }
    return {
      url: longUrl,
      statusCode: 302,
    }
  }
}
