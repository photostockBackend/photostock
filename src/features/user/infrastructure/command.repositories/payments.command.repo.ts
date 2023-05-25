import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { UserDomain } from '../../../../core/domain/user.domain';

@Injectable()
export class PaymentsCommandRepo {
  constructor(private prisma: PrismaService) {}
  async update(userWithPayment: UserDomain): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: {
        id: userWithPayment.id,
      },
      data: {
        paymentsInfo: {
          upsert: {
            where: { id: 1 },
            update: {
              paymentMethodId: userWithPayment.paymentsInfo.filter(
                (p) => p.paymentService === 'stripe',
              )[0].paymentMethodId,
              customerId: userWithPayment.paymentsInfo.filter(
                (p) => p.paymentService === 'stripe',
              )[0].customerId,
              payments: {
                create: {
                  periodStart: userWithPayment.paymentsInfo.filter(
                    (p) => p.paymentService === 'stripe',
                  )[0].payments[0]?.periodStart,
                  periodEnd: userWithPayment.paymentsInfo.filter(
                    (p) => p.paymentService === 'stripe',
                  )[0].payments[0]?.periodEnd,
                  amount: userWithPayment.paymentsInfo.filter(
                    (p) => p.paymentService === 'stripe',
                  )[0].payments[0]?.amount,
                  currency: userWithPayment.paymentsInfo.filter(
                    (p) => p.paymentService === 'stripe',
                  )[0].payments[0]?.currency,
                  product: userWithPayment.paymentsInfo.filter(
                    (p) => p.paymentService === 'stripe',
                  )[0].payments[0]?.product,
                },
              },
            },
            create: {
              paymentMethodId: userWithPayment.paymentsInfo.filter(
                (p) => p.paymentService === 'stripe',
              )[0].paymentMethodId,
              customerId: userWithPayment.paymentsInfo.filter(
                (p) => p.paymentService === 'stripe',
              )[0].customerId,
              paymentService: 'stripe',
            },
          },
        },
      },
    });
    return !!result;
  }

  async findUserWithPaymentsByUserId(userId: number): Promise<UserDomain> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        credInfo: true,
        paymentsInfo: {
          include: {
            payments: true,
          },
        },
      },
    });
    if (!foundUser) return null;
    const user = new UserDomain({
      username: foundUser.username,
      email: foundUser.email,
      passwordHash: foundUser.credInfo.passwordHash,
    });
    await user.setAll(foundUser);
    await user.setPayments(foundUser.paymentsInfo);
    return user;
  }
}
