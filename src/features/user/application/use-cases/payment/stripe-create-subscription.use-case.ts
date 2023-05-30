import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { StripeAdapter } from '../../../../../adapters/payment/stripe.service';
import { CreateSubscriptionInputModel } from '../../../types/payments/payments-input.models';
import { PaymentsCommandRepo } from '../../../infrastructure/command.repositories/payments.command.repo';

export class StripeCreateSubscriptionCommand {
  constructor(
    public readonly userId: number,
    public readonly createSubscriptionInputModel: CreateSubscriptionInputModel,
  ) {}
}
@CommandHandler(StripeCreateSubscriptionCommand)
export class StripeCreateSubscriptionUseCase
  implements ICommandHandler<StripeCreateSubscriptionCommand>
{
  constructor(
    private stripe: StripeAdapter,
    private paymentsCommandRepo: PaymentsCommandRepo,
  ) {}
  async execute(command: StripeCreateSubscriptionCommand): Promise<void> {
    const user = await this.paymentsCommandRepo.findUserWithPaymentsByUserId(
      command.userId,
    );
    if (
      !user.paymentsInfo.filter((p) => p.paymentService === 'stripe').length
    ) {
      throw new BadRequestException({
        message: [
          {
            field: 'attached-card',
            message: 'attached-card not found',
          },
        ],
      });
    }
    if (command.createSubscriptionInputModel.renewal) {
      const result = await this.stripe.createSubcription(
        user.paymentsInfo.filter((p) => p.paymentService === 'stripe')[0]
          .customerId,
      );
      user.paymentsInfo.forEach((p) => {
        if (p.paymentService === 'stripe') {
          p.payments.push({
            periodStart: result.subscription.current_period_start,
            periodEnd: result.subscription.current_period_end,
            amount: command.createSubscriptionInputModel.amount,
            currency: 'usd',
            product: result.plan.product.toString(),
          });
        }
      });
    }
    if (!command.createSubscriptionInputModel.renewal) {
      const result = await this.stripe.createCharge(
        command.createSubscriptionInputModel.amount,
        'usd',
        user.paymentsInfo.filter((p) => p.paymentService === 'stripe')[0]
          .paymentMethodId,
      );
      console.log('charge', result);
    }
    await this.paymentsCommandRepo.update(user);
  }
}
