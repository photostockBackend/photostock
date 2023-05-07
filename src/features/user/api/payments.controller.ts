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

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiResponse({
    status: 200,
    description:
      'The user for payment-service has been successfully created',
  })
  @HttpCode(200)
  @Post('strapi/createcustomer')
  async strapiCreateCustomer(@Req() req: RequestWithUser) {
    
  }

  @ApiResponse({
    status: 200,
    description:
      'The user for payment-service has been successfully created',
  })
  @HttpCode(200)
  @Post('paypal/createcustomer')
  async paypalCreateCustomer(@Req() req: RequestWithUser) {
    
  }

}

