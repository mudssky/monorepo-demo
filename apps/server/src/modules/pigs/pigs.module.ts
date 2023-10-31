import { Module } from '@nestjs/common'
import { PigsController } from '@/modules/pigs/pigs.controller'

@Module({
  controllers: [PigsController],
})
export class PigsModule {}
