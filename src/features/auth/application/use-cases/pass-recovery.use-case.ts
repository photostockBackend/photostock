import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PassRecoveryCommand } from './commands/pass-recovery.command';
import { AuthService } from '../services/auth.service';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';
import { MailService } from '../../../../adapters/mail/mail.service';

@CommandHandler(PassRecoveryCommand)
export class PassRecoveryUseCase
  implements ICommandHandler<PassRecoveryCommand>
{
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private usersRepository: UsersRepo,
  ) {}
  async execute(command: PassRecoveryCommand): Promise<boolean> {
    const { email } = command;
    const user = await this.usersRepository.findOneByField('email', email);
    if (!user) return false;
    await user.updCode();
    await this.mailService.sendEmail('', user.email, user.credInfo.code, '');
    return true;
  }
}
