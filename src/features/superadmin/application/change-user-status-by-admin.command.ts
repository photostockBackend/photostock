import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepo, USERS_REPO } from '../../auth/types/interfaces/i-users.repo';
import { ChangeUserStatus } from '../dto/users.args';

export class ChangeUserStatusByAdminCommand {
  constructor(
    public readonly changeUserStatusArgs: ChangeUserStatus,
  ) {}
}

@CommandHandler(ChangeUserStatusByAdminCommand)
export class ChangeUserStatusByAdminUseCase
  implements ICommandHandler<ChangeUserStatusByAdminCommand>
{
  constructor(
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: ChangeUserStatusByAdminCommand): Promise<boolean> {
    const user = await this.usersRepository.findOneByFilter({
      id: command.changeUserStatusArgs.userId,
    });
    if (!user) return false;
    user.setStatus(command.changeUserStatusArgs);
    return await this.usersRepository.update(user);
  }
}
