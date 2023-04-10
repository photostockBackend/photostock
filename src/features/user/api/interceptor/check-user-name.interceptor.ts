import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from '../../../auth/application/services/auth.service';
import { Observable } from 'rxjs';
import RequestWithUser from '../../../types/interfaces/request-with-user.interface';

@Injectable()
export class CheckUserNameInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    const user = await this.authService.findOneByFilter({
      username: req.body.username,
    });
    if (user && user.id !== req.user.userId)
      throw new BadRequestException({
        message: [
          {
            field: 'username',
            message: 'username already used',
          },
        ],
      });
    return next.handle().pipe();
  }
}
