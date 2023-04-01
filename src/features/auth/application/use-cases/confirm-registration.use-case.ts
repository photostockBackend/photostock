import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmRegistrationCommand } from './commands/confirm-registration.command';
import { AuthService } from '../services/auth.service';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(
    private authService: AuthService,
    protected usersRepository: UsersRepo,
  ) {}
  async execute(command: ConfirmRegistrationCommand): Promise<boolean> {
    const { code } = command;
    const user = await this.authService.findUserByField('code', code);
    if (!user) return false;
    const result = await user.confirmEmail();
    if (!result) return false;
    return await this.usersRepository.update(user);
  }
}
