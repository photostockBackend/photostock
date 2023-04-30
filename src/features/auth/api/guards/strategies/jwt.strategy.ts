import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class BearerAuthGuard extends AuthGuard('jwt') {}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  console.log('configService.get('JWT_SECRET')', configService.get('JWT_SECRET'))
  constructor(public configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId };
  }
}
