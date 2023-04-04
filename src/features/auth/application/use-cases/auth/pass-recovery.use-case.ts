import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PassRecoveryCommand } from './commands/pass-recovery.command';
import { MailService } from '../../../../../adapters/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthCommandRepo } from '../../../infrastructure/command.repositories/command.repo';

@CommandHandler(PassRecoveryCommand)
export class PassRecoveryUseCase
  implements ICommandHandler<PassRecoveryCommand>
{
  /*constructor(
    private authService: AuthService,
    private mailService: MailService,
    private usersRepository: UsersRepo,
  ) {}
  async execute(command: PassRecoveryCommand): Promise<boolean> {
    const { email } = command;
    const user = await this.usersRepository.findOneByField('email', email);
    if (!user) return false;
    await user.updCode();
    await this.mailService.sendEmail(command.frontendAdress, user.email, user.credInfo.code, 'password-recovery?recoveryCode');
    return true;
  }*/

  constructor(
    protected mailService: MailService,
    private usersRepo: AuthCommandRepo,
  ) {}

  async execute(command: PassRecoveryCommand) {
    const code = uuidv4();
    await this.usersRepo.passwordRecovery(command.email, code);
    await this.mailService.sendEmail(
      command.frontendAdress,
      command.email,
      code,
      'password-recovery?recoveryCode',
    );
    return;
  }
}
