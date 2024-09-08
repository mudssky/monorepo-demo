import { GlobalConfigService } from '@/common/config/index'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Profile, Strategy } from 'passport-github2'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: GlobalConfigService) {
    super({
      clientID: configService.get<boolean>('GITHUB_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GITHUB_OAUTH_CALLBACK_URL'),
      scope: configService.get('GITHUB_OAUTH_SCOPE'),
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return profile
  }
}
