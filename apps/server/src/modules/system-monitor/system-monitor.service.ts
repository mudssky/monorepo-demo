import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import si from 'systeminformation'
import { Cache } from 'cache-manager'
@Injectable()
export class SystemMonitorService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getStaticData() {
    const staticData = await si.getStaticData()
    return staticData
  }
}
