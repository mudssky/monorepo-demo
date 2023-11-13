import { GlobalWsExceptionFilter } from './ws-exception.filter'

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new GlobalWsExceptionFilter()).toBeDefined()
  })
})
