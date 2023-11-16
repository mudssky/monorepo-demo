import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { MockGlobalModule } from '../mock-global/mock-global.module'
import { UserModule } from '../user/user.module'
import { AuthService } from './auth.service'
import { WsJwtAuthGuard } from './guards/ws-jwt-auth/ws-jwt-auth.guard'
import { JwtStrategy } from './jwt.strategy'
import { LocalStrategy } from './local.strategy'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        MockGlobalModule,
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy, WsJwtAuthGuard],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
