import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../services/auth.service';
import { Inject } from '@nestjs/common';
import { IUsersRepo, USERS_REPO } from '../../../types/interfaces/i-users.repo';
import { emailRecoveryFlag } from '../../../../types/domain/user.domain';

export class ConfirmRegistrationCommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(
    private authService: AuthService,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: ConfirmRegistrationCommand): Promise<boolean> {
    const { code } = command;
    const user = await this.authService.findOneByFilter({
      credInfo: { code: code },
    });
    if (!user) return false;
    const result = await user.confirmCode(emailRecoveryFlag.email);
    if (!result) return false;
    return await this.usersRepository.update(user);
  }
}
