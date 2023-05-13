import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

export class GoogleAuthGuard extends AuthGuard('google') {}
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    public configService: ConfigService
  ) {
    super({
      clientID: configService.get('GOOGLE_OAUTH2_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_OAUTH2_SECRET'),
      callbackURL: 'http://localhost:5000/oauth2/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return true || null;
  }
}