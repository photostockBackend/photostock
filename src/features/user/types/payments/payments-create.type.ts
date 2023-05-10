export type Payments = {
  id?: number
  createdAt: string
  amount: number
  currency: string
  product: string
}

export type PaymentInfoCreateType = {
  id?: number;        
  paymentMethodId: string;
  customerId: string;
  paymentService: string;         
  userId: number;
  payments: Payments[] 
};
