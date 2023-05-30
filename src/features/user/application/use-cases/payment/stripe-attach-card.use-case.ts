import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StripeAdapter } from '../../../../../adapters/payment/stripe.service';
import { AttachCardInputModel } from '../../../types/payments/payments-input.models';
import { PaymentsCommandRepo } from '../../../infrastructure/command.repositories/payments.command.repo';
import { PaymentDomain } from '../../../../../core/domain/payment.domain';

export class StripeAttachCardCommand {
  constructor(
    public readonly userId: number,
    public readonly attachCardInputModel: AttachCardInputModel,
  ) {}
}

@CommandHandler(StripeAttachCardCommand)
export class StripeAttachCardUseCase
  implements ICommandHandler<StripeAttachCardCommand>
{
  constructor(
    private stripe: StripeAdapter,
    private paymentsCommandRepo: PaymentsCommandRepo,
  ) {}
  async execute(command: StripeAttachCardCommand): Promise<void> {
    const user = await this.paymentsCommandRepo.findUserWithPaymentsByUserId(
      command.userId,
    );
    if (
      !user.paymentsInfo.filter((p) => p.paymentService === 'stripe').length
    ) {
      const customerId = await this.stripe.createCustomer(user.email);
      const paymentMethodId = await this.stripe.createPaymentMethod(
        command.attachCardInputModel,
      );
      const paymentsInfo = new PaymentDomain({
        customerId,
        paymentMethodId,
        userId: command.userId,
        paymentService: 'stripe',
        payments: [],
      });
      user.paymentsInfo.push(paymentsInfo);
    }
    await this.stripe.attachPaymentMethodToCustomer(
      user.paymentsInfo.filter((p) => p.paymentService === 'stripe')[0]
        .customerId,
      user.paymentsInfo.filter((p) => p.paymentService === 'stripe')[0]
        .paymentMethodId,
    );
    await this.paymentsCommandRepo.update(user);
  }
}
