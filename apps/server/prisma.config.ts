import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
const rawUrl = env('DATABASE_URL')
// 保持 .env.development 中 DATABASE_URL 为不带引号的形式：DATABASE_URL=postgresql://...
// console.log({ rawUrl ,l:process.env.DATABASE_URL})
const sanitizedUrl =
  typeof rawUrl === 'string' ? rawUrl.replace(/^\s*["']|["']\s*$/g, '') : rawUrl
console.log('DATABASE_URL', sanitizedUrl)
export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: sanitizedUrl,
  },
})
