import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GithubOauthService } from '../../../../../adapters/oauth/githubOauth.service';
import { Oauth2InputModel } from '../../../types/auth-input.models';
import { TokensType } from '../../../types/tokens.type';

export class AuthWithGithubCommand {
  constructor(
    oauth2InputModel: Oauth2InputModel
  ) {}
}
@CommandHandler(AuthWithGithubCommand)
export class AuthWithGithubUseCase
  implements ICommandHandler<AuthWithGithubCommand>
{
  constructor(
    private githubOauthService: GithubOauthService,
  ) {}
  async execute(command: AuthWithGithubCommand): Promise<TokensType> {
    return;
  }
}
