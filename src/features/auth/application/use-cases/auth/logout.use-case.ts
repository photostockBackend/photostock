import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './commands/logout.command';
import { AuthService } from '../../services/auth.service';
import {
  ITokensInfoRepo,
  TOKEN_INFO_REPO,
} from '../../../types/interfaces/i-tokens-info.repo';
import { Inject } from '@nestjs/common';

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private authService: AuthService,
    @Inject(TOKEN_INFO_REPO) private tokenInfoRepository: ITokensInfoRepo,
  ) {}
  async execute(command: LogoutCommand): Promise<boolean> {
    const { userId, deviceId } = command;
    const user = await this.authService.findOneByFilter({ id: userId });
    if (!user) return false;
    return await this.tokenInfoRepository.deleteOneByFilter({
      userId,
      deviceId,
    });
  }
}
