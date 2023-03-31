import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from '../../adapters/mail/mail.module';
import { JWT } from '../../helpers/jwt';
import { AuthController } from './api/auth.controller';

const commands = []
const queries = []

@Module({
  controllers: [AuthController],
  imports: [
    MailModule,
    CqrsModule,
  ],
  providers: [
    JwtService,
    JWT,
    ...commands,
    ...queries,
  ],
})
export class AuthModule {}