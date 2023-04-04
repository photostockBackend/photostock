import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './commands/logout.command';
import { AuthCommandRepo } from '../../../infrastructure/command.repositories/command.repo';
import { JWT } from '../../../../../helpers/jwt';

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  /*constructor(
    private authService: AuthService,
    private tokensInfoRepository: TokensInfoRepo,
  ) {}
  async execute(command: LogoutCommand): Promise<boolean> {
    const { userId, deviceId } = command;
    const user = await this.authService.findUserByField('userId', userId);
    if (!user) return false;
    return await this.tokensInfoRepository.deleteOne({ userId, deviceId });
  }*/
  constructor(
    private devicesRepo: AuthCommandRepo,
    private readonly jwtService: JWT,
  ) {}

  async execute(command: LogoutCommand) {
    const { userId, deviceId, issuedAt } = command;

    const res = await this.devicesRepo.logout(userId, deviceId, issuedAt);
    /*if(res.deletedCount === 0) {
      throw new HttpException('Session not found', HttpStatus.UNAUTHORIZED)
    } else {
      return
    }*/
    return;
  }
}
