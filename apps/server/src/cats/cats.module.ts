import { Module } from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

// 全局化模块,当您想要提供一组开箱即用的提供程序（例如帮助程序、数据库连接等）时，请使用 @Global() 装饰器使模块全局化。
// @Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService, CatsController],
})
export class CatsModule {}
