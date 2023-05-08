import { Stripe } from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeAdapter {
  private readonly stripe: Stripe
  private product: any
  constructor(
    private readonly configService: ConfigService
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY'),
      {apiVersion: '2022-11-15'},
    );
    this.initProduct()
  }

  async initProduct() {
    this.product = await this.stripe.products.create({name: 'Inctagram subscription'})
  }

  async createCustomer(email: string): Promise<string> {
    /*const res = await this.stripe.customers.list()
    for(let i=0; i<res.data.length; i++){
      this.stripe.customers.del(res.data[i].id)
    }*/

    const result = await this.stripe.customers.list({email: email})
    /*if(result.data.length > 0) {
      return false
    }*/
    const customer = await this.stripe.customers.create({
      email
    })
    return customer.id
  }

  async createPaymentMethod({cardNumber, expMonth, expYear, cvc}) {
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

  async attachPaymentMethodToCustomer(customerId, paymentMethodId) {
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
      const result = await this.stripe.customers.list()
      return true;
    } catch (error) {
      console.error('attacherror', error);
      throw error;
    }
  };

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