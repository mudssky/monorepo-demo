import path from 'node:path'
import type { PrismaConfig } from 'prisma'

export default {
  schema: path.join(__dirname, 'prisma'),
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
} satisfies PrismaConfig
