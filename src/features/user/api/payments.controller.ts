import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { BearerAuthGuard } from '../../auth/api/guards/strategies/jwt.strategy';
import { StripeAttachCardCommand } from '../application/use-cases/payment/stripe-attach-card.use-case';
import { StripeCreateSubscriptionCommand } from '../application/use-cases/payment/stripe-create-subscription.use-case';
import { PaymentsQueryRepo } from '../infrastructure/query.repositories/payments.query.repo';
import { AttachCardInputModel, CreateSubscriptionInputModel } from '../types/payments/payments-input.models';
import { StripeWebhookSubscriptionUpdatedCommand } from '../application/use-cases/payment/stripe-webhook-subscriptionupdated.use-case';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private commandBus: CommandBus, 
    private paymentsQueryRepo: PaymentsQueryRepo,
  ) {}

  @ApiResponse({
    status: 201,
    description:
      'The card has been successfully attached',
  })
  @HttpCode(201)
  @UseGuards(BearerAuthGuard)
  @Post('stripe/attachcard')
  async stripeAttachCustomer(@Req() req: RequestWithUser, @Body() attachCardInputModel: AttachCardInputModel) {
    const result = await this.commandBus.execute(new StripeAttachCardCommand(req.user.userId, attachCardInputModel));
    return result
  }

  @ApiResponse({
    status: 201,
    description:
      'The subscription has been successfully created',
  })
  @HttpCode(201)
  @UseGuards(BearerAuthGuard)
  @Post('stripe/createsubcription')
  async stripeCreateSubscription(@Req() req: RequestWithUser, @Body() createSubscriptionInputModel: CreateSubscriptionInputModel) {
    const result = await this.commandBus.execute(new StripeCreateSubscriptionCommand(req.user.userId, createSubscriptionInputModel));
    return result
  }

  @Post('stripe/webhook/subscriptionupdated')
  async stripeWebhookSubscriptionUpdated(@Body() body: any) {
    this.commandBus.execute(new StripeWebhookSubscriptionUpdatedCommand(body));
    return 
  }

  @ApiResponse({
    status: 200,
    description:
      'The list of payments has been successfully returned',
  })
  @HttpCode(200)
  @UseGuards(BearerAuthGuard)
  @Get('getallpayments')
  async getAllPayments(@Req() req: RequestWithUser, @Body() body: any) {
    
    return
  }

  @ApiResponse({
    status: 200,
    description:
      'The current subscription has been successfully returned',
  })
  @HttpCode(200)
  @UseGuards(BearerAuthGuard)
  @Get('getcurrentsubscription')
  async getCurrentPayment(@Req() req: RequestWithUser, @Body() body: any) {
    
    return
  }

}

