import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { LocalStrategy } from './local.strategy'

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
