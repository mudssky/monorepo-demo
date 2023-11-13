import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { UserModule } from '../user/user.module'
import { JwtStrategy } from './jwt.strategy'
import { WsJwtAuthGuard } from './guards/ws-jwt-auth/ws-jwt-auth.guard'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const config = {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<number>('JWT_EXPIRATION'),
          },
        }
        return config
      },
      inject: [ConfigService], // 注入 ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, WsJwtAuthGuard],
  exports: [AuthService, WsJwtAuthGuard, JwtModule],
})
export class AuthModule {}
