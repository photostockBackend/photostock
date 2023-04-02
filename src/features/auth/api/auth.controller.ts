import {Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseError } from '../../../helpers/common/swagger-decorators/error-api-swagger';
import { ErrorSwagger } from '../../../helpers/common/types/errored';
import { LoginInputModel, NewPasswordInputModel, PasswordRecoveryInputModel, RegistrationConfirmationInputModel, RegistrationEmailInputModel, RegistrationInputModel } from '../types/auth-input.models';
import { AuthCommandRepo } from '../infrastructure/command.repo';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
        private repo: AuthCommandRepo,
    ) {}

    @ApiResponse({ status: 204, description: 'The user has been successfully registrated.'})
    @HttpCode(204)
    @Post('password-recovery')
    async passwordRecovery(passwordRecoveryInputModel: PasswordRecoveryInputModel){
        return 
    }

    @ApiResponse({ status: 204, description: 'The user has been successfully registrated.'})
    @HttpCode(204)
    @Post('new-password')
    async newPassword(newPasswordInputModel: NewPasswordInputModel){
        return 
    }

    @ApiBody({type: LoginInputModel})
    @ApiResponse({ status: 200, description: 'The user has been successfully logined.'})
    @HttpCode(200)
    @Post('login')
    async login(@Req() req, @Res({ passthrough: true }) res){
        return 
    }

    @ApiResponse({ status: 200, description: 'The tokens has been successfully refreshed.'})
    @HttpCode(200)
    @Post('refresh-token')
    async refreshTokens(@Req() req, @Res({ passthrough: true }) res){
        return 
    }

    @ApiResponse({ status: 204, description: 'The user has been successfully registration-confimated.'})
    @HttpCode(204)
    @Post('registration-confirmation')
    async registrationConfirmation(@Body() registrationConfirmationInputModel: RegistrationConfirmationInputModel){
        return 
    }

    @ApiResponse({ status: 204, description: 'The user has been successfully registrated.'})
    @HttpCode(204)
    @Post('registration')
    async registration(@Body() registrationInputModel: RegistrationInputModel){
        await this.repo.registration(registrationInputModel)
        return 
    }

    @ApiResponse({ status: 204, description: 'The user has been successfully registrated.'})
    @HttpCode(204)
    @Post('registration-email-resending')
    async registrationEmailResending(@Body() registrationEmailInputModel: RegistrationEmailInputModel){
        return 
    }

    @ApiResponse({ status: 204, description: 'The user has been successfully logout.'})
    @HttpCode(204)
    @Post('logout')
    async logout(@Req() req){
        return 
    }

    @ApiResponse({ status: 200, description: 'The user has been successfully identified.'})
    @HttpCode(200)
    @Get('me')
    async getAuthMe(@Req() req){
        return 
    }
}