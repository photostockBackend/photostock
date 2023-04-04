import { ITokensInfoRepo } from '../../../types/interfaces/i-tokens-info.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSessionCommand } from './commands/delete-session.command';

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private tokenInfoRepository: ITokensInfoRepo) {}

  async execute(command: DeleteSessionCommand): Promise<boolean> {
    const { userId, deviceId } = command;
    return await this.tokenInfoRepository.deleteOneByFilter({
      userId: userId,
      deviceId: deviceId,
    });
  }
}
