import { UpdateProfileInputModel } from '../../../types/profile/user-profile-input.models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StripeAdapter } from '../../../../../adapters/payment/stripe.service';
import { Inject } from '@nestjs/common';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../../types/interfaces/i-profile-user.repo';
import { AttachCardInputModel } from '../../../types/payments/payments-input.models';
import { PaymentsCommandRepo } from '../../../../user/infrastructure/command.repositories/payments.command.repo';

export class StrapiAttachCardCommand {
  constructor(
    public readonly userId: number,
    public readonly attachCardInputModel: AttachCardInputModel,
  ) {}
}

@CommandHandler(StrapiAttachCardCommand)
export class StrapiAttachCardUseCase
  implements ICommandHandler<StrapiAttachCardCommand>
{
  constructor(
    private stripe: StripeAdapter,
    private paymentsCommandRepo: PaymentsCommandRepo,
  ) {}
  async execute(command: StrapiAttachCardCommand): Promise<void> {
    const user = await this.paymentsCommandRepo.findUserWithPaymentsByUserId(command.userId)
    
  }
}
