import { ITokensInfoRepo } from '../../../types/interfaces/i-tokens-info.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSessionCommand } from './commands/delete-session.command';
import { Inject } from '@nestjs/common';

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(
    @Inject('TOKEN INFO REPO')
    private tokensInfoRepository: ITokensInfoRepo,
  ) {}

  async execute(command: DeleteSessionCommand): Promise<boolean> {
    const { userId, deviceId } = command;
    return await this.tokensInfoRepository.deleteOneByFilter({
      userId: userId,
      deviceId: deviceId,
    });
  }
}
