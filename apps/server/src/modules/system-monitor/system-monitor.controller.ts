import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SystemMonitorService } from './system-monitor.service'
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager'

@ApiTags('system-monitor')
@Controller('system-monitor')
export class SystemMonitorController {
  constructor(private readonly systemMonitorService: SystemMonitorService) {}
  @ApiOperation({ summary: '获取硬件信息' })
  // @CacheKey('custom_key') 也可以覆盖缓存的key值
  @CacheTTL(10 * 60 * 60 * 1000) //过期时间设置10小时
  @UseInterceptors(CacheInterceptor)
  @Get('staticData')
  async getStaticData() {
    return this.systemMonitorService.getStaticData()
  }
}
