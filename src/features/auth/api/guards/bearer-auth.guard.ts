import { AuthGuard } from '@nestjs/passport';

export class BearerAuthGuard extends AuthGuard('jwt') {}
