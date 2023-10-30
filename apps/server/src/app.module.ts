import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatsController } from './cats/cats.controller'
import { PigsController } from './pigs/pigs.controller'

@Module({
  imports: [],
  controllers: [AppController, CatsController, PigsController],
  providers: [AppService],
})
export class AppModule {}
