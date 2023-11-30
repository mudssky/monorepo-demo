import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import si from 'systeminformation'
@Injectable()
export class SystemMonitorService {
  async getCpu() {
    return await si.cpu()
  }
  async getMem() {
    const memData = await si.mem()
    return memData
  }
  async getProcesses() {
    return await si.processes()
  }
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
