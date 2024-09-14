import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'

export interface GoogleAuthInfo {
  accessToken: string
  profile: Profile
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_OAUTH_CALLBACK_URL'),
      scope: configService.get('GOOGLE_OAUTH_SCOPE'),
    })
  }

  /**
   * @param accessToken
   * @param refreshToken
   * @param profile
   * @returns
   */
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      accessToken,
      profile,
    } satisfies GoogleAuthInfo
  }
}
