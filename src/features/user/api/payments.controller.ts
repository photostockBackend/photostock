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
import { StrapiAttachCardCommand } from '../application/use-cases/payment/strapi-attach-card.use-case';
import { StrapiCreateSubscriptionCommand } from '../application/use-cases/payment/strapi-create-subscription.use-case';
import { PaymentsQueryRepo } from '../infrastructure/query.repositories/payments.query.repo';
import { AttachCardInputModel, CreateSubscriptionInputModel } from '../types/payments/payments-input.models';

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
  @Post('strapi/attachcard')
  async strapiAttachCustomer(@Req() req: RequestWithUser, @Body() attachCardInputModel: AttachCardInputModel) {
    await this.commandBus.execute(new StrapiAttachCardCommand(req.user.userId, attachCardInputModel));
    return;
  }

  @ApiResponse({
    status: 201,
    description:
      'The subscription has been successfully created',
  })
  @HttpCode(201)
  @UseGuards(BearerAuthGuard)
  @Post('strapi/createsubcription')
  async strapiCreateSubscription(@Req() req: RequestWithUser, @Body() createSubscriptionInputModel: CreateSubscriptionInputModel) {
    await this.commandBus.execute(new StrapiCreateSubscriptionCommand(req.user.userId, createSubscriptionInputModel));
    return;
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

