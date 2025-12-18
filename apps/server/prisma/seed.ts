import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '#prisma/client'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // 可在此处添加初始化数据逻辑
  // 例如：确保 MeetingRooms 表存在后插入一条示例数据
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('Seed: database reachable')
  } catch (e) {
    console.error('Seed failed:', e)
    throw e
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
