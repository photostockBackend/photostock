import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { StripeAdapter } from '../../../../../adapters/payment/stripe.service';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../../types/interfaces/i-profile-user.repo';
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
    const user = await this.paymentsCommandRepo.findUserWithPaymentsByUserId(command.userId)
    if(!user.paymentsInfo.filter(p => p.paymentService === 'stripe').length) {
      throw new BadRequestException({
        message: [
          {
            field: 'attached-card',
            message: 'attached-card not found',
          },
        ],
      });
    }
    if(command.createSubscriptionInputModel.renewal) {
      await this.stripe.createSubcription(
        user.paymentsInfo.filter(p => p.paymentService === 'stripe')[0].customerId
      )
    } 
    if(!command.createSubscriptionInputModel.renewal) {
      await this.stripe.createCharge(
        command.createSubscriptionInputModel.amount, 
        'usd', 
        user.paymentsInfo.filter(p => p.paymentService === 'stripe')[0].paymentMethodId
      )
    } 

  }
}
