import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { PaymentAdapter } from './payment.service';

@Module({
  imports: [],
  providers: [PaymentAdapter],
  exports: [PaymentAdapter],
})
export class PaymentModule {}
