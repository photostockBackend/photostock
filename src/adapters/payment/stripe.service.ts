import { Stripe } from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeAdapter {
  private readonly stripe: Stripe
  
  constructor(
    private readonly configService: ConfigService
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY'),
      {apiVersion: '2022-11-15'},
    );
  }

  createCustomer() {
    this.stripe.customers.create()
  }

  async createPaymentMethod(cardNumber, expMonth, expYear, cvc) {
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
      return paymentMethod;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async attachPaymentMethodToCustomer(customerId, paymentMethodId) {
    try {
      const customer = await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      return customer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

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