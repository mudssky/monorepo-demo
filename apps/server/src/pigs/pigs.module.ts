import { Module } from '@nestjs/common'
import { PigsController } from './pigs.controller'

@Module({
  controllers: [PigsController],
})
export class PigsModule {}
