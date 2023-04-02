import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from '../../adapters/mail/mail.module';
import { JWT } from '../../helpers/jwt';
import { AuthController } from './api/auth.controller';
import { AuthCommandRepo } from './infrastructure/command.repo';
import { PrismaModule } from '../../database/prisma.module';
import { AuthMeHandler } from './application/queries/handlers/auth-me.handler';
import { AuthQueryRepo } from './infrastructure/query.repo';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegistrationUseCase } from './application/use-cases/registration.use-case';
import { ConfirmRegistrationUseCase } from './application/use-cases/confirm-registration.use-case';
import { NewPassUseCase } from './application/use-cases/new-pass.use-case';
import { PassRecoveryUseCase } from './application/use-cases/pass-recovery.use-case';
import { ResendEmailUseCase } from './application/use-cases/resend-email.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { CreateNewPairTokensUseCase } from './application/use-cases/create-new-pair-tokens.use-case';
import { AuthService } from './application/services/auth.service';
import { CheckEmailInterceptor } from './api/interceptors/check-email.interceptor';
import { BasicStrategy } from './api/guards/strategies/basic.strategy';
import { LocalStrategy } from './api/guards/strategies/local.strategy';
import { JwtStrategy } from './api/guards/strategies/jwt.strategy';
import { RefreshStrategy } from './api/guards/strategies/refresh.strategy';
import { BearerAuthGuard } from './api/guards/bearer-auth.guard';
import { BasicAuthGuard } from './api/guards/basic-auth.guard';
import { LocalAuthGuard } from './api/guards/local-auth.guard';
import { RefreshAuthGuard } from './api/guards/refresh-auth.guard';

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
const repositories = [AuthCommandRepo, AuthQueryRepo];
const strategies = [BasicStrategy, LocalStrategy, JwtStrategy, RefreshStrategy];
const guards = [
  BearerAuthGuard,
  BasicAuthGuard,
  LocalAuthGuard,
  RefreshAuthGuard,
];
const interceptors = [CheckEmailInterceptor];

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
})
export class AuthModule {}
