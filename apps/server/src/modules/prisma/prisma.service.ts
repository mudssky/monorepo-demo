import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }
  /**
   * 添加排除函数，因为prisma没有办法在查询时排除字段
   * @param user
   * @param keys
   * @returns
   */
  exclude<User, Key extends keyof User>(
    user: User | null,
    keys: Key[],
  ): Omit<User, Key> | null {
    if (!user) {
      return user
    }
    return Object.fromEntries(
      Object.entries(user as any).filter(([key]) => !keys.includes(key as any)),
    ) as Omit<User, Key>
  }
}
