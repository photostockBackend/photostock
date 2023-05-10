import { Stripe } from 'stripe';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeAdapter implements OnModuleInit {
  private readonly stripe: Stripe
  private product: any
  constructor(
    private readonly configService: ConfigService
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY'),
      {apiVersion: '2022-11-15'},
    );
  }
  
  async onModuleInit(){
    const currentProduct = await this.stripe.products.list()
    if(currentProduct.data.length > 0) {
      this.product = currentProduct.data[0]
      return
    }
    this.product = await this.stripe.products.create({name: 'Inctagram subscription'})
  }

  async createCustomer(email: string): Promise<string> {
    const currentCustomer = await this.stripe.customers.list({email: email})
    if(currentCustomer.data.length > 0) {
      return currentCustomer.data[0].id
    }
    const customer = await this.stripe.customers.create({
      email
    })
    return customer.id
  }

  async createPaymentMethod({cardNumber, expMonth, expYear, cvc}) {
    const res = await this.stripe.paymentMethods.list()
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardNumber,
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cvc,
        },
      });
      return paymentMethod.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async attachPaymentMethodToCustomer(customerId: string, paymentMethodId: string) {
    try {
      await this.stripe.paymentMethods.attach(
        paymentMethodId,
        {customer: customerId}
      );
      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })
      return true;
    } catch (error) {
      console.error('attacherror', error);
      throw error;
    }
  };

  async createCharge(amount: number, currency: string, paymentMethodId: string): Promise<Stripe.Charge> {
    try {
      const charge = await this.stripe.charges.create({
        amount,
        currency,
        source: paymentMethodId,
      });
      return charge;
    } catch (error) {
      throw error;
    }
  }

  async createSubcription(customerId: string){
    const plan = await this.stripe.plans.create({
      amount: 1,
      currency: 'usd',
      interval: 'day',
      product: this.product.id,
    });
    this.stripe.subscriptions.create(
      {
        customer: customerId, 
        items: [
          {
            plan: plan.id, 
          },
        ],
      },
    );
  }

  async detachPaymentMethodFromCustomer(customerId, paymentMethodId) {
    try {
      const detachResult = await this.stripe.paymentMethods.detach(paymentMethodId);
      const customer = await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: null,
        },
      });
      return customer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
 
}