import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EventEmitterAdapter } from './eventEmitter.service';

@Module({
  imports: [],
  providers: [EventEmitterAdapter],
  exports: [EventEmitterAdapter],
})
export class EventEmitterModule {}
