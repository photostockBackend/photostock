import { DeleteSessionsExcludeCurrentCommand } from './commands/delete-sessions-exclude-current.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ITokensInfoRepo } from '../../../types/interfaces/i-tokens-info.repo';
import { Inject } from '@nestjs/common';

@CommandHandler(DeleteSessionsExcludeCurrentCommand)
export class DeleteSessionsExcludeCurrentUseCase
  implements ICommandHandler<DeleteSessionsExcludeCurrentCommand>
{
  constructor(
    @Inject('TOKEN INFO REPO')
    private tokensInfoRepository: ITokensInfoRepo
  ) {}

  async execute(
    command: DeleteSessionsExcludeCurrentCommand,
  ): Promise<boolean> {
    const { userId, deviceId } = command;
    return await this.tokensInfoRepository.deleteAllExceptCurrentDeviceId(
      userId,
      deviceId,
    );
  }
}
