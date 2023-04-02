import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './commands/logout.command';
import { AuthService } from '../services/auth.service';
import { TokensInfoRepo } from '../../types/interfaces/tokens-info-repo.interface';

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private authService: AuthService,
    private tokensInfoRepository: TokensInfoRepo,
  ) {}
  async execute(command: LogoutCommand): Promise<boolean> {
    const { userId, deviceId } = command;
    const user = await this.authService.findUserByField('userId', userId);
    if (!user) return false;
    return await this.tokensInfoRepository.deleteOne({ userId, deviceId });
  }
}
