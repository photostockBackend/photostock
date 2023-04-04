import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PassRecoveryCommand } from './commands/pass-recovery.command';
import { MailService } from '../../../../../adapters/mail/mail.service';
import { AuthService } from '../../services/auth.service';
import { Inject } from '@nestjs/common';
import { IUsersRepo, USERS_REPO } from '../../../types/interfaces/i-users.repo';

@CommandHandler(PassRecoveryCommand)
export class PassRecoveryUseCase
  implements ICommandHandler<PassRecoveryCommand>
{
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: PassRecoveryCommand): Promise<boolean> {
    const { email, frontendAddress } = command;
    const user = await this.usersRepository.findOneByFilter({ email: email });
    if (!user) return false;
    await user.updCode();
    await this.mailService.sendEmail(
      frontendAddress,
      user.email,
      user.credInfo.code,
      'password-recovery?recoveryCode',
    );
    return await this.usersRepository.update(user);
  }
}
