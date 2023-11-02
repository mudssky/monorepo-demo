const getEnvConfig = () => ({
  port: parseInt(process.env.PORT ?? '33101', 10) ?? 33101,
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
  logger: {
    level: process.env.LOGGER_LEVEL ?? 'debug',
  },
})
export type GlobalConfig = ReturnType<typeof getEnvConfig>

export default getEnvConfig
