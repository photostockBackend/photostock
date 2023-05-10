import { PaymentInfoCreateType, Payments } from "../../features/user/types/payments/payments-create.type";

export class PaymentDomain {
  constructor(private paymentDto: PaymentInfoCreateType) {
    this.paymentMethodId = paymentDto.paymentMethodId
    this.customerId = paymentDto.customerId
    this.paymentService = paymentDto.paymentService
    this.userId = paymentDto.userId
    this.payments = paymentDto.payments
  }
  id: number;
  paymentMethodId: string;
  customerId: string;
  paymentService: string;         
  userId: number;
  payments: Payments[]

  setAll(paymentDto: PaymentInfoCreateType) {
    this.id = paymentDto.id
    this.paymentMethodId = paymentDto.paymentMethodId
    this.customerId = paymentDto.customerId
    this.paymentService = paymentDto.paymentService
    this.userId = paymentDto.userId
    this.payments = paymentDto.payments
  }
}