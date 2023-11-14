import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('system-monitor')
@Controller('system-monitor')
export class SystemMonitorController {
  @ApiOperation({ summary: '获取硬件信息' })
  @Get('hardwareInfo')
  async getHardwareInfo() {}
}
