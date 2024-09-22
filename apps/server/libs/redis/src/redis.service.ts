import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Redis } from 'ioredis'
import {
  MODULE_OPTIONS_TOKEN,
  RedisModuleOptions,
} from './cofig.module-definition'

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: Redis
  private readonly logger = new Logger(RedisService.name)
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options?: RedisModuleOptions,
  ) {
    const { redisOptions = {} } = options || {}
    this.redisClient = new Redis({
      db: 0,
      ...redisOptions,
    })
  }
  async onModuleInit() {
    this.logger.log('Redis connection established')
  }

  async get(key: string) {
    return await this.redisClient.get(key)
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)
    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }
}
