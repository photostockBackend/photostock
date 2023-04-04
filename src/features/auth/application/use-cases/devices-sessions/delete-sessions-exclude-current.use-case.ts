import { DeleteSessionsExcludeCurrentCommand } from './commands/delete-sessions-exclude-current.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ITokensInfoRepo } from '../../../types/interfaces/i-tokens-info.repo';

@CommandHandler(DeleteSessionsExcludeCurrentCommand)
export class DeleteSessionsExcludeCurrentUseCase
  implements ICommandHandler<DeleteSessionsExcludeCurrentCommand>
{
  constructor(private tokenInfoRepository: ITokensInfoRepo) {}

  async execute(
    command: DeleteSessionsExcludeCurrentCommand,
  ): Promise<boolean> {
    const { userId, deviceId } = command;
    return await this.tokenInfoRepository.deleteAllExceptCurrentDeviceId(
      userId,
      deviceId,
    );
  }
}
