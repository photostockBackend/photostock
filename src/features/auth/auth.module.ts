import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from '../../adapters/mail/mail.module';
import { JWT } from '../../helpers/jwt';
import { AuthController } from './api/auth.controller';
import { AuthCommandRepo } from './infrastructure/command.repo';
import { PrismaModule } from '../../database/prisma.module';

const commands = []
const queries = []

@Module({
  controllers: [AuthController],
  imports: [
    MailModule,
    CqrsModule,
    PrismaModule,
  ],
  providers: [
    AuthCommandRepo,
    JwtService,
    JWT,
    ...commands,
    ...queries,
  ],
})
export class AuthModule {}