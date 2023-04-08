import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ITokensInfoRepo,
  TOKEN_INFO_REPO,
} from '../../../types/interfaces/i-tokens-info.repo';
import { Inject } from '@nestjs/common';

export class DeleteSessionsExcludeCurrentCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceId: string,
  ) {}
}
@CommandHandler(DeleteSessionsExcludeCurrentCommand)
export class DeleteSessionsExcludeCurrentUseCase
  implements ICommandHandler<DeleteSessionsExcludeCurrentCommand>
{
  constructor(
    @Inject(TOKEN_INFO_REPO) private tokenInfoRepository: ITokensInfoRepo,
  ) {}

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
