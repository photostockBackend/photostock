import * as Paypal from 'paypal-rest-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalAdapter {
  private readonly paypal: typeof Paypal
  constructor(
    private readonly configService: ConfigService
  ) {
    this.paypal = Paypal
    this.paypal.configure({
      client_id: this.configService.get('PAYPAL_CLIENT_ID'),
      client_secret: this.configService.get('PAYPAL_SECRET'),
      mode: 'sandbox',
    })
  }

  async createCustomer() {
    const billingPlan = {
      name: 'Example Plan',
      description: 'Example Plan Description',
      type: 'INFINITE',
      payment_definitions: [
        {
          name: 'Regular Payment',
          type: 'REGULAR',
          frequency: 'MONTH',
          frequency_interval: '1',
          amount: {
            value: '9.99',
            currency: 'USD',
          },
          cycles: '0',
        },
      ],
      merchant_preferences: {
        return_url: 'http://localhost:3000/payment/success',
        cancel_url: 'http://localhost:3000/payment/cancel',
        auto_bill_amount: 'YES',
        initial_fail_amount_action: 'CONTINUE',
        max_fail_attempts: '3',
        setup_fee: {
          value: '0.99',
          currency: 'USD',
        },
      },
    };
    
    const createBillingPlan = (billingPlan) => {
      return new Promise((resolve, reject) => {
        this.paypal.billingPlan.create(billingPlan, (error, plan) => {
          if (error) {
            reject(error);
          } else {
            resolve(plan);
          }
        });
      });
    }
    const pay = await createBillingPlan(billingPlan)
    console.log('pay', pay)
  }

  async createPaymentMethod({cardNumber, expMonth, expYear, cvc}) {
    
  };

  async attachPaymentMethodToCustomer(customerId, paymentMethodId) {
    
  };

  async createSubcription(customerId: string){
    
  }

  async detachPaymentMethodFromCustomer(customerId, paymentMethodId) {
    
  };
 
}