import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
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
  RegistrationEmailInputModel,
  RegistrationInputModel,
} from '../types/auth-input.models';
import { RegistrationCommand } from '../application/use-cases/commands/registration.command';
import { CheckEmailInterceptor } from './interceptors/check-email.interceptor';
import { ConfirmRegistrationCommand } from '../application/use-cases/commands/confirm-registration.command';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginCommand } from '../application/use-cases/commands/login.command';
import { TokensType } from '../types/tokens.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiResponse({
    status: 204,
    description: 'The user has been successfully registrated.',
  })
  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(
    passwordRecoveryInputModel: PasswordRecoveryInputModel,
  ) {
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The user has been successfully registrated.',
  })
  @HttpCode(204)
  @Post('new-password')
  async newPassword(newPasswordInputModel: NewPasswordInputModel) {
    return;
  }

  @ApiBody({ type: LoginInputModel })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logined.',
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res) {
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
    return res
      .status(200)
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/auth/refresh-token',
      })
      .json({ accessToken: tokens.accessToken });
  }

  @ApiResponse({
    status: 200,
    description: 'The tokens has been successfully refreshed.',
  })
  @HttpCode(200)
  @Post('refresh-token')
  async refreshTokens(@Req() req, @Res({ passthrough: true }) res) {
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The user has been successfully registration-confimated.',
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
    >(
      new ConfirmRegistrationCommand(
        registrationConfirmationInputModel.recoveryCode,
      ),
    );
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
  @UseInterceptors(CheckEmailInterceptor)
  @HttpCode(204)
  @Post('registration')
  async registration(@Body() registrationInputModel: RegistrationInputModel) {
    await this.commandBus.execute(
      new RegistrationCommand(registrationInputModel),
    );
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The user has been successfully registrated.',
  })
  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResending(
    @Body() registrationEmailInputModel: RegistrationEmailInputModel,
  ) {
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The user has been successfully logout.',
  })
  @HttpCode(204)
  @Post('logout')
  async logout(@Req() req) {
    return;
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully identified.',
  })
  @HttpCode(200)
  @Get('me')
  async getAuthMe(@Req() req) {
    return;
  }
}
