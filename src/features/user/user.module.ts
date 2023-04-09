import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../database/prisma.module';
import { UserController } from './api/user.controller';
import { AuthModule } from '../auth/auth.module';
import { CheckUserNameInterceptor } from './api/interceptor/check-user-name.interceptor';

const commands = [];
const queries = [];
const services = [];
const repositories = [];
const strategies = [];
const guards = [];
const interceptors = [CheckUserNameInterceptor];

@Module({
  controllers: [UserController],
  imports: [CqrsModule, PrismaModule, AuthModule],
  providers: [
    ...commands,
    ...queries,
    ...services,
    ...repositories,
    ...strategies,
    ...guards,
    ...interceptors,
  ],
})
export class UserModule {}
