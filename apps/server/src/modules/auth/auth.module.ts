import { SECOND } from '@/common/constant'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { WsJwtAuthGuard } from './guards/ws-jwt-auth/ws-jwt-auth.guard'
import { JwtStrategy } from './strategy/jwt.strategy'
import { LocalStrategy } from './strategy/local.strategy'
import { GithubStrategy } from './strategy/github.strategy'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const config = {
          secret: configService.get<string>('JWT_SECRET') ?? 'secret',
          signOptions: {
            expiresIn:
              (configService.get<number>('JWT_EXPIRATION') ?? 0) * SECOND,
          },
        }
        return config
      },
      inject: [ConfigService], // 注入 ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, WsJwtAuthGuard,GithubStrategy],
  exports: [AuthService, WsJwtAuthGuard, JwtModule],
})
export class AuthModule {}
