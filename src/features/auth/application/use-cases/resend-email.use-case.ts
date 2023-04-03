import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResendEmailCommand } from './commands/resend-email.command';
import { AuthService } from '../services/auth.service';
import { MailService } from '../../../../adapters/mail/mail.service';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';
import { AuthCommandRepo } from '../../infrastructure/command.repo';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(ResendEmailCommand)
export class ResendEmailUseCase implements ICommandHandler<ResendEmailCommand> {
  /*constructor(
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
      command.frontendAdress,
      user.email,
      user.credInfo.code,
      'confirm-registration?code',
    );
    await this.usersRepository.update(user);
    return true;
  }*/
  constructor(
    protected mailService: MailService,
    private usersRepo: AuthCommandRepo,
  ) {}

  async execute(command: ResendEmailCommand){
    const code = uuidv4()
    await this.usersRepo.registrationEmailResending(command.email, code)
    await this.mailService.sendEmail(command.frontendAdress, command.email, code, 'confirm-registration?code')
    return true
  }
}
