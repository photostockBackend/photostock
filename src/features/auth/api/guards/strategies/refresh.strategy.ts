import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../../application/services/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    public configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: false,
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.cookies.refreshToken;
          if (!token) {
            throw new UnauthorizedException();
          }
          return token;
        },
      ]),
    });
  }

  async validate(payload: any) {
    if (!payload) throw new UnauthorizedException();
    const tokenValid = await this.authService.checkPayloadRefreshToken(payload);
    if (!tokenValid) throw new UnauthorizedException();
    return {
      deviceId: payload.deviceId,
      userId: payload.userId,
    };
  }
}
