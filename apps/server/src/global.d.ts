export interface EnvConfig {
  PORT: string
  LOG_LEVEL: string
  JWT_SECRET: string
  JWT_EXPIRATION: number
}
export type EnvConfigKey = keyof EnvConfig

declare global {
  EnvConfig
}
