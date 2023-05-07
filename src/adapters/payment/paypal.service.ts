import * as Paypal from 'paypal-rest-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalAdapter {
  private readonly paypal: typeof Paypal
  
  constructor(
    private readonly configService: ConfigService
  ) {
    this.paypal.configure({
      client_id: this.configService.get('PAYPAL_CLIENT_ID'),
      client_secret: this.configService.get('PAYPAL_SECRET'),
      mode: 'sandbox',
    })
  }

  createCustomer() {

  }

 
}