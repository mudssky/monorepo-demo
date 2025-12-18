import winston from 'winston'

export const customLogFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : ''
    const messageStr =
      typeof message === 'object' ? JSON.stringify(message) : message
    return `${timestamp} [${level}]: ${messageStr} ${metaStr}`
  },
)
export const commonFileFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.json(),
)
