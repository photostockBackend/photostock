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

  async test(){
    const session = await this.stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/stripe/success',
      cancel_url: 'http://localhost:3000/stripe/error',
      line_items: [{
          price_data: {
              product_data: {
                  name: `prod ids:`,
                  description: 'buing products',
              },
              unit_amount: 100 * 100,
              currency: 'USD'
          },
          quantity: 1,
      }],
      mode: 'payment',
      client_reference_id: '999'
  })
  console.log('session', session)
    return session 
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
    const subscription = await this.stripe.subscriptions.create(
      {
        customer: customerId, 
        items: [
          {
            plan: plan.id, 
          },
        ],
      },
    );
    return {plan, subscription}
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

  async attachCard() {
    // проверка наличия клиента
    const customer = await this.stripe.customers.create({
      email: 'mail@mail.com'
    })
    // сессия с setup картой
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      customer: customer.id,
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    })
    console.log('session', session.url)
    return session
  }

  async webhook(rawBody, stripeSignature) {
    let event;
    let customerId: string;
    let paymentMethodId: string;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, stripeSignature, process.env.STRIPE_SIGNING_SECRET);
      if (event.type === 'checkout.session.completed') {
        const session = await this.stripe.checkout.sessions.retrieve(event.data.object.id)

        const setupIntent = await this.stripe.setupIntents.retrieve(event.data.object.setup_intent);
        console.log('setupIntent', setupIntent)
        console.log('setupIntent.payment_method', setupIntent.payment_method)

        const card = await this.stripe.paymentMethods.retrieve(`${setupIntent.payment_method}`)
        console.log('card', card)

        const list = await this.stripe.paymentMethods.list({customer: `${setupIntent.customer}`})
        console.log('list', list)
        console.log('list', list.data[0].card)
        // сохранение карты в базу

        customerId = setupIntent.customer as string
        paymentMethodId = setupIntent.payment_method as string
      }
    } catch (err) {
      console.log('err--------------', err)
    }
    if (customerId && paymentMethodId) {
      console.log(customerId)
      console.log(paymentMethodId)
      try {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: 100099,
          currency: 'usd',
          customer: customerId,
          payment_method: paymentMethodId,
          off_session: true,
          confirm: true,
          capture_method: "manual",

        });
        console.log(paymentIntent)

      } catch (err) {
        console.log('Error code will be authentication_required if authentication is needed')
      }
    }
  }

  async cupture() {
    const paymentIntent = await this.stripe.paymentIntents.capture(
      'нужный id paymentIntent', {amount_to_capture: 90000}
    );
    console.log('paymentIntent')
    console.log(paymentIntent)
  }
}