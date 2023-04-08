import {
  ITokensInfoRepo,
  TOKEN_INFO_REPO,
} from '../../../types/interfaces/i-tokens-info.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

export class DeleteSessionCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceId: string,
  ) {}
}
@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(
    @Inject(TOKEN_INFO_REPO) private tokenInfoRepository: ITokensInfoRepo,
  ) {}

  async execute(command: DeleteSessionCommand): Promise<boolean> {
    const { userId, deviceId } = command;
    return await this.tokenInfoRepository.deleteOneByFilter({
      userId: userId,
      deviceId: deviceId,
    });
  }
}
