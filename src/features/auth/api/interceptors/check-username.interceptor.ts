import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class CheckUserNameInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const user = await this.authService.findOneByFilter({
      userName: req.body.userName,
      credInfo: { isActivated: true },
    });
    if (user)
      throw new BadRequestException({
        message: [
          {
            field: 'userName',
            message: 'userName already used',
          },
        ],
      });

    return next.handle().pipe();
  }
}
