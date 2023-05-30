import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import * as process from 'process';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    if (!body.recaptchaValue) throw new ForbiddenException();
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?response=${body.recaptchaValue}&secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}`,
    );
    if (!data.success) throw new ForbiddenException();
    return true;
  }
}
