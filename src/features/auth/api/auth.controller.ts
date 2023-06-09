import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginInputModel,
  NewPasswordInputModel,
  PasswordRecoveryInputModel,
  RegistrationConfirmationInputModel,
  RegistrationEmailResendingInputModel,
  RegistrationInputModel,
} from '../types/auth-input.models';
import { TokensType } from '../types/tokens.type';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { AuthMeViewModel, ViewModelToken } from '../types/auth-view.models';
import { Response } from 'express';
import { ConfirmRegistrationCommand } from '../application/use-cases/auth/confirm-registration.use-case';
import { PassRecoveryCommand } from '../application/use-cases/auth/pass-recovery.use-case';
import { NewPassCommand } from '../application/use-cases/auth/new-pass.use-case';
import { LoginCommand } from '../application/use-cases/auth/login.use-case';
import { CreateNewPairTokensCommand } from '../application/use-cases/auth/create-new-pair-tokens.use-case';
import { RegistrationCommand } from '../application/use-cases/auth/registration.use-case';
import { ResendEmailCommand } from '../application/use-cases/auth/resend-email.use-case';
import { LogoutCommand } from '../application/use-cases/auth/logout.use-case';
import { AuthMeCommand } from '../application/queries/auth/handlers/auth-me.handler';
import { LocalAuthGuard } from './guards/strategies/local.strategy';
import { CheckUserNameEmailInterceptor } from './interceptors/check-user-name-email.interceptor';
import { RefreshAuthGuard } from './guards/strategies/refresh.strategy';
import { ApiResponseError } from '../../../helpers/common/swagger-decorators/error-api-swagger';
import { ErrorSwagger } from '../../../helpers/common/types/errored';
import { RecaptchaGuard } from './guards/recaptcha.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiResponse({
    status: 204,
    description: 'The code for pass-recovery sended to email.',
  })
  @ApiResponseError(ErrorSwagger)
  @UseGuards(RecaptchaGuard)
  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(
    @Body() passwordRecoveryInputModel: PasswordRecoveryInputModel,
    @Req() req,
  ) {
    const result = await this.commandBus.execute<
      PassRecoveryCommand,
      Promise<boolean>
    >(
      new PassRecoveryCommand(
        passwordRecoveryInputModel.email,
        req.headers.origin,
      ),
    );
    if (!result)
      throw new BadRequestException({
        message: [
          {
            field: 'email',
            message: 'invalid email',
          },
        ],
      });
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The password has been successfully changed.',
  })
  @HttpCode(204)
  @Post('new-password')
  async newPassword(@Body() newPasswordInputModel: NewPasswordInputModel) {
    const result = await this.commandBus.execute<
      NewPassCommand,
      Promise<boolean>
    >(new NewPassCommand(newPasswordInputModel));
    if (!result)
      throw new BadRequestException({
        message: [
          {
            field: 'recoveryCode',
            message: 'invalid recoveryCode',
          },
        ],
      });
    return;
  }

  @ApiBody({ type: LoginInputModel })
  @ApiResponse({
    status: 200,
    description:
      'The user-profile has been successfully logined. Return access-token in response, and refresh-token in cookie',
    type: ViewModelToken,
  })
  @ApiResponse({
    status: 401,
    description: 'The email or password is not correct.',
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.commandBus.execute<
      LoginCommand,
      Promise<TokensType>
    >(
      new LoginCommand(
        req.user.userId,
        String(req.headers['user-profile-agent']),
        req.ip,
      ),
    );
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
      'The tokens has been successfully refreshed. Return access-token in response, and refresh-token in cookie',
    type: ViewModelToken,
  })
  @ApiResponse({
    status: 401,
    description: 'The refresh-token is not valid.',
  })
  @UseGuards(RefreshAuthGuard)
  @HttpCode(200)
  @Post('refresh-token')
  async refreshTokens(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.commandBus.execute<
      CreateNewPairTokensCommand,
      Promise<TokensType>
    >(
      new CreateNewPairTokensCommand(
        req.user.userId,
        req.user.deviceId,
        req.ip,
      ),
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { accessToken: tokens.accessToken };
  }

  @ApiResponse({
    status: 204,
    description:
      'The user-profile has been successfully registration-confimated.',
  })
  @ApiResponseError(ErrorSwagger)
  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(
    @Body()
    registrationConfirmationInputModel: RegistrationConfirmationInputModel,
  ) {
    const result = await this.commandBus.execute<
      ConfirmRegistrationCommand,
      Promise<boolean>
    >(new ConfirmRegistrationCommand(registrationConfirmationInputModel.code));
    if (!result)
      throw new BadRequestException({
        message: [{ field: 'code', message: 'invalid code' }],
      });
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The user-profile has been successfully registrated.',
  })
  @ApiResponseError(ErrorSwagger)
  @UseInterceptors(CheckUserNameEmailInterceptor)
  @HttpCode(204)
  @Post('registration')
  async registration(
    @Body() registrationInputModel: RegistrationInputModel,
    @Req() req: RequestWithUser,
  ) {
    await this.commandBus.execute(
      new RegistrationCommand(registrationInputModel, req.headers.origin),
    );
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The new-code has been successfully sended.',
  })
  @ApiResponseError(ErrorSwagger)
  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResending(
    @Body() registrationEmailInputModel: RegistrationEmailResendingInputModel,
    @Req() req: RequestWithUser,
  ) {
    const result = await this.commandBus.execute<
      ResendEmailCommand,
      Promise<boolean>
    >(
      new ResendEmailCommand(
        registrationEmailInputModel.email,
        req.headers.origin,
      ),
    );
    if (!result)
      throw new BadRequestException({
        message: [
          {
            field: 'email',
            message: 'invalid email or email already confirmed',
          },
        ],
      });
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The user-profile has been successfully logout.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user-profile is not authorized.',
  })
  @UseGuards(RefreshAuthGuard)
  @HttpCode(204)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    const result = await this.commandBus.execute<
      LogoutCommand,
      Promise<boolean>
    >(new LogoutCommand(req.user.userId, req.user.deviceId));
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @ApiResponse({
    status: 200,
    description: 'The user-profile has been successfully identified.',
    type: AuthMeViewModel,
  })
  @ApiResponse({
    status: 401,
    description: 'The user-profile is not authorized.',
  })
  @UseGuards(RefreshAuthGuard)
  @HttpCode(200)
  @Get('me')
  async getAuthMe(@Req() req: RequestWithUser) {
    return await this.queryBus.execute<AuthMeCommand, Promise<AuthMeViewModel>>(
      new AuthMeCommand(req.user.userId),
    );
  }
}
