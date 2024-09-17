import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // 创建时指定全局omitAPI
      omit: {
        user: {
          password: true,
        },
      },
      // 可以配置log
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    })
  }
  async onModuleInit() {
    await this.$connect()
    const casbinRuleCount = await this.casbinRule.count()
    // 初始化一条规则针对管理员
    if (casbinRuleCount === 0) {
      this.casbinRule.createMany({
        data: {
          ptype: 'p',
          v0: 'ADMIN',
          v1: '/*',
          v2: '(GET|POST)',
        },
      })
    }
  }
  /**
   * 添加排除函数，因为prisma没有办法在查询时排除字段
   * @param user
   * @param keys
   * @returns
   * @deprecated Prisma ORM 5.16.0开始，已经支持omitApi
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
