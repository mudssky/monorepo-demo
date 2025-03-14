import { HOUR, SECOND } from '@/common/constant/index'
import { ApiCustomResponse } from '@/common/decorators/swagger'
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager'
import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  CpuDataDto,
  CurrentLoadDataDto,
  DynamicDataDto,
  MemDataDto,
  ProcessesDataDto,
  StaticDataDto,
} from './dto/system-monitor.dto'
import { SystemMonitorService } from './system-monitor.service'

@ApiTags('system-monitor')
@Controller('system-monitor')
export class SystemMonitorController {
  constructor(private readonly systemMonitorService: SystemMonitorService) {}

  @ApiOperation({ summary: '获取硬件信息' })
  @ApiCustomResponse({
    type: StaticDataDto,
  })
  // @CacheKey('custom_key') 也可以覆盖缓存的key值
  @CacheTTL(10 * HOUR) //过期时间设置10小时
  @UseInterceptors(CacheInterceptor)
  @Get('getStaticData')
  async getStaticData() {
    return this.systemMonitorService.getStaticData()
  }

  @ApiOperation({ summary: '获取动态信息' })
  @ApiCustomResponse({
    type: DynamicDataDto,
  })
  @CacheTTL(30 * SECOND) //过期时间设置30秒
  @UseInterceptors(CacheInterceptor)
  @Get('getDynamicData')
  async getDynamicData() {
    return await this.systemMonitorService.getDynamicData()
  }

  @ApiOperation({ summary: '获取进程信息' })
  @ApiCustomResponse({
    type: ProcessesDataDto,
  })
  @CacheTTL(30 * SECOND)
  @UseInterceptors(CacheInterceptor)
  @Get('getProcesses')
  async getProcesses() {
    return await this.systemMonitorService.getProcesses()
  }

  @ApiOperation({ summary: '获取内存信息' })
  @ApiCustomResponse({
    type: MemDataDto,
  })
  @CacheTTL(4 * SECOND)
  @UseInterceptors(CacheInterceptor)
  @Get('getMem')
  async getMem() {
    return await this.systemMonitorService.getMem()
  }

  @ApiOperation({ summary: '获取cpu信息' })
  @ApiCustomResponse({
    type: CpuDataDto,
  })
  @CacheTTL(4 * SECOND)
  @UseInterceptors(CacheInterceptor)
  @Get('getCpu')
  async getCpu() {
    return await this.systemMonitorService.getCpu()
  }

  @ApiOperation({ summary: '获取当前系统负载' })
  @ApiCustomResponse({
    type: CurrentLoadDataDto,
  })
  @CacheTTL(4 * SECOND)
  @UseInterceptors(CacheInterceptor)
  @Get('getCurrentLoad')
  async getCurrentLoad() {
    return await this.systemMonitorService.getCurrentLoad()
  }
}
