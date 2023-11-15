import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { GlobalEnvConfigKey } from '@/common/config/config'
import { JwtPayload } from './types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET' as GlobalEnvConfigKey,
      ),
    })
  }

  async validate(payload: JwtPayload) {
    // console.log({ payload })
    return { userId: payload.sub, username: payload.username }
  }
}
