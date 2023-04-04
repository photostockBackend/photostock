import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './commands/logout.command';
import { AuthService } from '../../services/auth.service';
import { ITokensInfoRepo } from '../../../types/interfaces/i-tokens-info.repo';

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private authService: AuthService,
    private tokenInfoRepository: ITokensInfoRepo,
  ) {}
  async execute(command: LogoutCommand): Promise<boolean> {
    const { userId, deviceId } = command;
    const user = await this.authService.findUserByField('userId', userId);
    if (!user) return false;
    return await this.tokenInfoRepository.deleteOneByFilter({
      userId,
      deviceId,
    });
  }
}
