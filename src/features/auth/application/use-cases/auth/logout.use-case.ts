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
  /* constructor(
    private devicesRepo: AuthCommandRepo,
    private readonly jwtService: JWT,
  ) {}

  async execute(command: LogoutCommand) {
    const { userId, deviceId, issuedAt } = command;

    const res = await this.devicesRepo.logout(userId, deviceId, issuedAt);
    /!*if(res.deletedCount === 0) {
      throw new HttpException('Session not found', HttpStatus.UNAUTHORIZED)
    } else {
      return
    }*!/
    return;
  }*/
}
