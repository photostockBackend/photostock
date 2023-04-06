import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPassCommand } from './commands/new-pass.command';
import { AuthService } from '../../services/auth.service';
import { Inject } from '@nestjs/common';
import { IUsersRepo, USERS_REPO } from '../../../types/interfaces/i-users.repo';
import { emailRecoveryFlag } from '../../../../types/domain/user.domain';

@CommandHandler(NewPassCommand)
export class NewPassUseCase implements ICommandHandler<NewPassCommand> {
  constructor(
    private authService: AuthService,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: NewPassCommand): Promise<boolean> {
    const { recoveryCode, newPassword } = command.newPassDto;
    const user = await this.usersRepository.findOneByFilter({
      credInfo: { code: recoveryCode },
    });
    if (!user) return false;
    const result = await user.confirmCode(emailRecoveryFlag.recovery);
    if (!result) return false;
    const newPassHash = await this.authService.getPassHash(newPassword);
    await user.setPassHash(newPassHash);
    return await this.usersRepository.update(user);
  }
}
