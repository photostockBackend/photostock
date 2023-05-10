import { UpdateProfileInputModel } from '../../../types/profile/user-profile-input.models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StripeAdapter } from '../../../../../adapters/payment/stripe.service';
import { Inject } from '@nestjs/common';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../../types/interfaces/i-profile-user.repo';
import { AttachCardInputModel } from '../../../types/payments/payments-input.models';
import { PaymentsCommandRepo } from '../../../infrastructure/command.repositories/payments.command.repo';
import { PaymentDomain } from '../../../../../core/domain/payment.domain';

export class StripeWebhookSubscriptionUpdatedCommand {
  constructor(
    public readonly body: any,
  ) {}
}
@CommandHandler(StripeWebhookSubscriptionUpdatedCommand)
export class StripeWebhookSubscriptionUpdatedUseCase
  implements ICommandHandler<StripeWebhookSubscriptionUpdatedCommand>
{
  constructor(
    private stripe: StripeAdapter,
    private paymentsCommandRepo: PaymentsCommandRepo,
  ) {}
  async execute(command: StripeWebhookSubscriptionUpdatedCommand): Promise<void> {
    
  }
}
