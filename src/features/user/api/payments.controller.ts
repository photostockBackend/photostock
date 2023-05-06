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
export class oAuth2Controller {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiResponse({
    status: 200,
    description:
      'The user-profile has been successfully logined. Return access-token in response, and refresh-token in cookie',
  })
  @ApiResponse({
    status: 400,
    description: 'Code not transferred.',
  })
  @ApiResponse({
    status: 401,
    description: 'Auth with google not success.',
  })
  @HttpCode(200)
  @Post('createcustomer')
  async createCustomer(@Req() req: RequestWithUser) {
    
  }

}
