import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { JWT } from '../../helpers/jwt';
import { PrismaModule } from '../../database/prisma.module';
import { UserController } from './api/user.controller';
import { JwtStrategy } from '../auth/api/guards/strategies/jwt.strategy';
import { BearerAuthGuard } from '../auth/api/guards/bearer-auth.guard';

const commands = [
];
const queries = [];
const services = [];
const repositories = [
];
const strategies = [JwtStrategy];
const guards = [
  BearerAuthGuard,
];
const interceptors = [];

@Module({
  controllers: [UserController],
  imports: [CqrsModule, PrismaModule],
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
export class UserModule {}
