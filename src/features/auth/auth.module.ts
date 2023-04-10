import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from '../../adapters/mail/mail.module';
import { JWT } from '../../helpers/jwt';
import { AuthController } from './api/auth.controller';
import { AuthCommandRepo } from './infrastructure/command.repositories/auth.command.repo';
import { PrismaModule } from '../../database/prisma.module';
import { AuthMeHandler } from './application/queries/auth/handlers/auth-me.handler';
import { AuthQueryRepo } from './infrastructure/query.repositories/auth.query.repo';
import { LoginUseCase } from './application/use-cases/auth/login.use-case';
import { RegistrationUseCase } from './application/use-cases/auth/registration.use-case';
import { ConfirmRegistrationUseCase } from './application/use-cases/auth/confirm-registration.use-case';
import { NewPassUseCase } from './application/use-cases/auth/new-pass.use-case';
import { PassRecoveryUseCase } from './application/use-cases/auth/pass-recovery.use-case';
import { ResendEmailUseCase } from './application/use-cases/auth/resend-email.use-case';
import { LogoutUseCase } from './application/use-cases/auth/logout.use-case';
import { CreateNewPairTokensUseCase } from './application/use-cases/auth/create-new-pair-tokens.use-case';
import { AuthService } from './application/services/auth.service';
import {
  BasicAuthGuard,
  BasicStrategy,
} from './api/guards/strategies/basic.strategy';
import {
  LocalAuthGuard,
  LocalStrategy,
} from './api/guards/strategies/local.strategy';
import {
  BearerAuthGuard,
  JwtStrategy,
} from './api/guards/strategies/jwt.strategy';
import {
  RefreshAuthGuard,
  RefreshStrategy,
} from './api/guards/strategies/refresh.strategy';
import { TokenInfoCommandRepo } from './infrastructure/command.repositories/token-info.command.repo';
import { CheckOwnerDeviceInterceptor } from './api/interceptors/check.owner.device.interceptor';
import { TOKEN_INFO_REPO } from './types/interfaces/i-tokens-info.repo';
import { USERS_REPO } from './types/interfaces/i-users.repo';
import { CheckUserNameEmailInterceptor } from './api/interceptors/check-user-name-email.interceptor';

const commands = [
  RegistrationUseCase,
  ConfirmRegistrationUseCase,
  LoginUseCase,
  NewPassUseCase,
  PassRecoveryUseCase,
  ResendEmailUseCase,
  LogoutUseCase,
  CreateNewPairTokensUseCase,
];
const queries = [AuthMeHandler];
const services = [AuthService];
const repositories = [
  AuthQueryRepo,
  {
    provide: TOKEN_INFO_REPO,
    useClass: TokenInfoCommandRepo,
  },
  {
    provide: USERS_REPO,
    useClass: AuthCommandRepo,
  },
];
const strategies = [BasicStrategy, LocalStrategy, JwtStrategy, RefreshStrategy];
const guards = [
  BearerAuthGuard,
  BasicAuthGuard,
  LocalAuthGuard,
  RefreshAuthGuard,
];
const interceptors = [
  CheckUserNameEmailInterceptor,
  CheckOwnerDeviceInterceptor,
];

@Module({
  controllers: [AuthController],
  imports: [MailModule, CqrsModule, PrismaModule],
  providers: [
    JwtService,
    JWT,
    ...commands,
    ...queries,
    ...services,
    ...repositories,
    ...strategies,
    ...guards,
    ...interceptors,
  ],
  exports: [JwtService, AuthService, ...guards, ...repositories],
})
export class AuthModule {}
