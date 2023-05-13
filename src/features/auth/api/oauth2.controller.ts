import { Body, Controller, Get, HttpCode, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { ViewModelToken } from '../types/auth-view.models';
import { AuthWithGithubCommand } from '../application/use-cases/oauth2/registrationWithGithub.use-case';
import { TokensType } from '../types/tokens.type';
import { AuthWithGoogleCommand } from '../application/use-cases/oauth2/registrationWithGoogle.use-case';
import { Oauth2InputModel } from '../types/auth-input.models';

@ApiTags('oauth2')
@Controller('oauth2')
export class oAuth2Controller {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiResponse({
    status: 200,
    description:
      'The user-profile has been successfully logined. Return access-token in response, and refresh-token in cookie',
    type: ViewModelToken,
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
  @Get('google/login')
  async googleLogin(
    @Body() oauth2InputModel: Oauth2InputModel,
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.commandBus.execute<
      AuthWithGoogleCommand,
      Promise<TokensType>
    >(new AuthWithGithubCommand(oauth2InputModel));
    res.cookie('refreshToken', tokens.refreshToken, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { accessToken: tokens.accessToken };
  }

  @ApiResponse({
    status: 200,
    description:
      'The user-profile has been successfully logined. Return access-token in response, and refresh-token in cookie',
    type: ViewModelToken,
  })
  @ApiResponse({
    status: 400,
    description: 'Code not transferred.',
  })
  @ApiResponse({
    status: 401,
    description: 'Auth with github not success.',
  })
  @HttpCode(200)
  @Get('github/login')
  async githubLogin(
    @Body() oauth2InputModel: Oauth2InputModel,
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.commandBus.execute<
      AuthWithGithubCommand,
      Promise<TokensType>
    >(new AuthWithGithubCommand(oauth2InputModel));
    res.cookie('refreshToken', tokens.refreshToken, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { accessToken: tokens.accessToken };
  }
}
