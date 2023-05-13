import { ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';

export class GithubAuthGuard extends AuthGuard('github') {}
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    public configService: ConfigService
  ) {
    super({
      clientID: configService.get('GITHUB_OAUTH2_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_OAUTH2_SECRET'),
      callbackURL: 'http://localhost:5000/oauth2/github/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return true || null;
  }
}
