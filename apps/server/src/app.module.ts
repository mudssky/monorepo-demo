import { Module } from '@nestjs/common'
import { CatsModule } from './cats/cats.module'
import { PigsModule } from './pigs/pigs.module'
@Module({
  imports: [CatsModule, PigsModule],
})
export class AppModule {}
