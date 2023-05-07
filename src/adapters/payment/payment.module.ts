import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { StripeAdapter } from './stripe.service';
import { PaypalAdapter } from './paypal.service';

@Module({
  imports: [],
  providers: [StripeAdapter, PaypalAdapter],
  exports: [StripeAdapter, PaypalAdapter],
})
export class PaymentModule {}
