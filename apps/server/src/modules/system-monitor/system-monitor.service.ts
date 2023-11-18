import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import si from 'systeminformation'
@Injectable()
export class SystemMonitorService {
  async getDynamicData() {
    const staticData = await si.getDynamicData()
    return staticData
  }
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getStaticData() {
    const staticData = await si.getStaticData()
    return staticData
  }
}
