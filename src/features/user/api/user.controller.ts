import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { BearerAuthGuard } from '../../auth/api/guards/bearer-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiResponse({
    status: 200,
    description: 'The profile get for current user.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @UseGuards(BearerAuthGuard)
  @Get('profile')
  async getProfileforCurrentUser(@Req() req: RequestWithUser) {
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @Post('profile')
  async createProfileForCurrentUser(@Req() req: RequestWithUser) {
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully updated.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @Put('profile')
  async updateProfileForCurrentUser(@Req() req: RequestWithUser) {
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @Delete('profile')
  async deleteProfileForCurrentUser(@Req() req: RequestWithUser) {
    return;
  }
}
