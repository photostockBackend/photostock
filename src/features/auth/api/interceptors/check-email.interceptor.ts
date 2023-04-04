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
export class CheckEmailInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const user = await this.authService.findUserByField(
      'email',
      req.body.email,
    );
    if (user)
      throw new BadRequestException({
        message: [
          {
            field: 'email',
            message: 'email already used',
          },
        ],
      });

    return next.handle().pipe();
  }
}
