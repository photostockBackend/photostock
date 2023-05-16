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
        console.log('body.recaptchaValue', body.recaptchaValue)
      if (!body.recaptchaValue) throw new ForbiddenException();
      const { data } = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?response=${body.recaptchaValue}&secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}`,
      );
        console.log('data', data)
      if (!data.success) throw new ForbiddenException();
      return true;
    }
  }
