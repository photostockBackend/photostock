import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../application/services/auth.service';

export class LocalAuthGuard extends AuthGuard('local') {}
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'emailOrUsername', passwordField: 'password' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.checkCredentials(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: user.id };
  }
}
