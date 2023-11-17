import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus'
import path from 'node:path'
import { PrismaService } from '../prisma/prisma.service'
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: '健康检查' })
  check() {
    //   这里通过检查nestjs官方文档的响应来判断网络是否正常
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://nest.nodejs.cn'),
      // 检查磁盘占用情况，如果路径所在磁盘空间超过总存储的80%(thresholdPercent)以上，就会不健康
      // 也可以检查占用的大小，比如下面是检查占用大小是否超过250gb
      // () => this.disk.checkStorage('storage', {  path: '/', threshold: 250 * 1024 * 1024 * 1024, })
      () => {
        return this.disk.checkStorage('disk_storage', {
          path: path.resolve('.'),
          thresholdPercent: 0.8,
        })
      },
      // 检查堆内存占用，这里检查占用超过1.5gb为不健康
      () => this.memory.checkHeap('memory_heap', 1500 * 1024 * 1024),
      //   检查prisma连接状态
      () => this.prismaHealth.pingCheck('prisma_ping', this.prisma),
    ])
  }
}
