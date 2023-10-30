import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  //   上面是nestjs默认的配置

  //   verbose: true,
  // 添加tsconfig中的路径映射
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/$1',
  },
}

export default config
