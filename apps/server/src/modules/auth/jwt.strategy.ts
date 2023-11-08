import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvConfig, EnvConfigKey } from '@/global'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<EnvConfig>('JWT_SECRET' as EnvConfigKey),
    })
  }

  async validate(payload: any) {
    console.log({ payload })
    console.log('validate')

    return { userId: payload.sub, username: payload.username }
  }
}
