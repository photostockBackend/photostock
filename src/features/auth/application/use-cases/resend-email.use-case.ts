import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResendEmailCommand } from './commands/resend-email.command';
import { AuthService } from '../services/auth.service';
import { MailService } from '../../../../adapters/mail/mail.service';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';

@CommandHandler(ResendEmailCommand)
export class ResendEmailUseCase implements ICommandHandler<ResendEmailCommand> {
  constructor(
    private authService: AuthService,
    protected mailService: MailService,
    protected usersRepository: UsersRepo,
  ) {}
  async execute(command: ResendEmailCommand): Promise<boolean> {
    const { email } = command;
    const user = await this.authService.findUserByField('email', email);
    if (!user) return false;
    await user.updCode();
    if (await user.getEmailIsConfirmed()) return false;
    await this.mailService.sendEmail(
      '',
      user.email,
      user.emailConfirmationCode,
      '',
    );
    await this.usersRepository.update(user);
    return true;
  }
}
