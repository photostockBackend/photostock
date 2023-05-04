import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleOauthService } from '../../../../../adapters/oauth/googleOauth.service';
import { Oauth2InputModel } from '../../../types/auth-input.models';
import { TokensType } from '../../../types/tokens.type';

export class AuthWithGoogleCommand {
  constructor(
    oauth2InputModel: Oauth2InputModel
  ) {}
}
@CommandHandler(AuthWithGoogleCommand)
export class AuthWithGoogleUseCase
  implements ICommandHandler<AuthWithGoogleCommand>
{
  constructor(
    private googleOauthService: GoogleOauthService,
  ) {}
  async execute(command: AuthWithGoogleCommand): Promise<TokensType> {
    return;
  }
}
