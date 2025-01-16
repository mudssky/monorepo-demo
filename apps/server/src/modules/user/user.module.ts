import { Module } from '@nestjs/common'
import { SharedService } from '../global/shared.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController],
  providers: [UserService, SharedService],
  exports: [UserService],
})
export class UserModule {}
