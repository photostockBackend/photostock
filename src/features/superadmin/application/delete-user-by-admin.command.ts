import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepo, USERS_REPO } from '../../auth/types/interfaces/i-users.repo';

export class DeleteUserByAdminCommand {
  constructor(
    public readonly id: number,
  ) {}
}

@CommandHandler(DeleteUserByAdminCommand)
export class DeleteUserByAdminUseCase
  implements ICommandHandler<DeleteUserByAdminCommand>
{
  constructor(
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: DeleteUserByAdminCommand): Promise<boolean> {
    return this.usersRepository.delete(command.id)
  }
}
