import {
  Controller,
  Get,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { AuthMeViewModel, ViewModelToken } from '../types/auth-view.models';
import { AuthMeCommand } from '../application/queries/auth/handlers/auth-me.handler';
import { RefreshAuthGuard } from './guards/strategies/refresh.strategy';
import { GoogleAuthGuard } from './guards/strategies/google.strategy';
import { GithubAuthGuard } from './guards/strategies/github.strategy';

@ApiTags('oauth2')
@Controller('oauth2')
export class oAuth2Controller {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @HttpCode(200)
  @Get('google/login')
  async googleLogin(@Req() req: RequestWithUser) {}

  @HttpCode(200)
  @Get('github/login')
  async githubLogin(@Req() req: RequestWithUser) {}

}
