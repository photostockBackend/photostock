import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { StripeAdapter } from '../../../../../adapters/payment/stripe.service';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../../types/interfaces/i-profile-user.repo';
import { CreateSubscriptionInputModel } from '../../../types/payments/payments-input.models';

export class StrapiCreateSubscriptionCommand {
  constructor(
    public readonly userId: number,
    public readonly createSubscriptionInputModel: CreateSubscriptionInputModel,
  ) {}
}
@CommandHandler(StrapiCreateSubscriptionCommand)
export class StrapiCreateSubscriptionUseCase
  implements ICommandHandler<StrapiCreateSubscriptionCommand>
{
  constructor(
    private stripe: StripeAdapter,
    @Inject(PROFILE_USER_REPO) private profileRepository: IProfileUserRepo,
  ) {}
  async execute(command: StrapiCreateSubscriptionCommand): Promise<void> {

  }
}
