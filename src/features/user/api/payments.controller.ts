import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { StripeAdapter } from '../../../adapters/payment/stripe.service';
import { PaypalAdapter } from '../../../adapters/payment/paypal.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private commandBus: CommandBus, private queryBus: QueryBus,
    private stripe: StripeAdapter,
    private paypal: PaypalAdapter,
  ) {}

  @ApiResponse({
    status: 200,
    description:
      'The user for payment-service has been successfully created',
  })
  @HttpCode(200)
  @Post('strapi/createcustomer')
  async strapiCreateCustomer(@Req() req: RequestWithUser, @Body() body: {email: string}): Promise<{customerId: string}> {
    const result = await this.stripe.createCustomer(body.email)
    return {customerId: result}
  }

  @ApiResponse({
    status: 200,
    description:
      'The user for payment-service has been successfully created',
  })
  @HttpCode(200)
  @Post('strapi/attachcard')
  async strapiAttachCustomer(@Req() req: RequestWithUser, @Body() body: any) {
    const paymentMethodId = await this.stripe.createPaymentMethod(body)
    await this.stripe.attachPaymentMethodToCustomer(body.customerId, paymentMethodId)
  }

  @ApiResponse({
    status: 200,
    description:
      'The user for payment-service has been successfully created',
  })
  @HttpCode(200)
  @Post('strapi/createsubcription')
  async strapiCreateSubscription(@Req() req: RequestWithUser, @Body() body: any) {
    await this.stripe.createSubcription(body.customerId)
  }

  @ApiResponse({
    status: 200,
    description:
      'The user for payment-service has been successfully created',
  })
  @HttpCode(200)
  @Post('paypal/createcustomer')
  async paypalCreateCustomer(@Req() req: RequestWithUser) {
    await this.paypal.createCustomer()
  }

}

