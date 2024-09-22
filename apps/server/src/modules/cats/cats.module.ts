import {
  Logger,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsDatabaseService, CatsService } from './cats.service'

// 全局化模块,当您想要提供一组开箱即用的提供程序（例如帮助程序、数据库连接等）时，请使用 @Global() 装饰器使模块全局化。
// @Global()
@Module({
  imports: [],
  controllers: [CatsController],
  providers: [CatsService, CatsDatabaseService],
  exports: [CatsService],
})
export class CatsModule
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnApplicationShutdown,
    OnModuleDestroy
{
  private readonly logger = new Logger(CatsModule.name)

  onModuleInit() {
    // throw new Error('Method not implemented.')
    this.logger.debug('CatsModule onModuleInit')
  }
  onApplicationBootstrap() {
    this.logger.debug('CatsModule onApplicationBootstrap')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onApplicationShutdown(signal?: string) {
    this.logger.debug('CatsModule onApplicationShutdown')
  }
  onModuleDestroy() {
    this.logger.debug('CatsModule onModuleDestroy')
  }
}
