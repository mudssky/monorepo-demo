import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { UserModule } from '../user/user.module'

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
        console.log({ config })

        return config
      },
      inject: [ConfigService], // 注入 ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
