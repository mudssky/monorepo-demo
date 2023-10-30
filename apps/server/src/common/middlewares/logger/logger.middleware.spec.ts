import { LoggerMiddleware } from './logger.middleware'

describe('LoggerMiddleware', () => {
  expect(new LoggerMiddleware()).toBeDefined()
})
