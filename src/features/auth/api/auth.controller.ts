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
import { RegistrationCommand } from '../application/use-cases/auth/commands/registration.command';
import { CheckEmailInterceptor } from './interceptors/check-email.interceptor';
import { ConfirmRegistrationCommand } from '../application/use-cases/auth/commands/confirm-registration.command';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginCommand } from '../application/use-cases/auth/commands/login.command';
import { TokensType } from '../types/tokens.type';
import { ResendEmailCommand } from '../application/use-cases/auth/commands/resend-email.command';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { CreateNewPairTokensCommand } from '../application/use-cases/auth/commands/create-new-pair-tokens.command';
import { PassRecoveryCommand } from '../application/use-cases/auth/commands/pass-recovery.command';
import { NewPassCommand } from '../application/use-cases/auth/commands/new-pass.command';
import { LogoutCommand } from '../application/use-cases/auth/commands/logout.command';
import { AuthMeCommand } from '../application/queries/auth/commands/auth-me.command';
import { AuthMeViewModel } from '../types/auth-view.models';
import { BearerAuthGuard } from './guards/bearer-auth.guard';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiResponse({
    status: 204,
    description: 'The code for pass-recovery sended to email.',
  })
  @ApiResponse({
    status: 400,
    description: 'The email for pass-recovery is not valid.',
  })
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
    description: 'The user has been successfully logined.',
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
        String(req.headers['user-agent']),
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
    description: 'The tokens has been successfully refreshed.',
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
    description: 'The user has been successfully registration-confimated.',
  })
  @ApiResponse({
    status: 400,
    description: 'The confirmation-code is not valid.',
  })
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
    description: 'The user has been successfully registrated.',
  })
  @ApiResponse({
    status: 400,
    description: 'The user with the given email already exists.',
  })
  @UseInterceptors(CheckEmailInterceptor)
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
    description: 'The user has been successfully registrated.',
  })
  @ApiResponse({
    status: 400,
    description: 'The user has been successfully registrated.',
  })
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
    description: 'The user has been successfully logout.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user is not authorized.',
  })
  @UseGuards(RefreshAuthGuard)
  @HttpCode(204)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    const result = await this.commandBus.execute<
      LogoutCommand,
      Promise<boolean>
    >(new LogoutCommand(req.user.userId, req.user.deviceId, req.user.issuedAt));
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully identified.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user is not authorized.',
  })
  @UseGuards(BearerAuthGuard)
  @HttpCode(200)
  @Get('me')
  async getAuthMe(@Req() req: RequestWithUser) {
    return await this.queryBus.execute<AuthMeCommand, Promise<AuthMeViewModel>>(
      new AuthMeCommand(req.user.userId),
    );
  }
}
