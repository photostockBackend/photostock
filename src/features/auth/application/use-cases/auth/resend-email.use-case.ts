import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../../adapters/mail/mail.service';
import { AuthService } from '../../services/auth.service';
import { Inject } from '@nestjs/common';
import { IUsersRepo, USERS_REPO } from '../../../types/interfaces/i-users.repo';

export class ResendEmailCommand {
  constructor(
    public readonly email: string,
    public readonly frontendAddress: string,
  ) {}
}
@CommandHandler(ResendEmailCommand)
export class ResendEmailUseCase implements ICommandHandler<ResendEmailCommand> {
  constructor(
    private authService: AuthService,
    protected mailService: MailService,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: ResendEmailCommand): Promise<boolean> {
    const { email } = command;
    const user = await this.authService.findOneByFilter({ email: email });
    if (!user) return false;
    await user.updCode();
    if (await user.getEmailIsConfirmed()) return false;
    await this.mailService.sendEmail(
      command.frontendAddress,
      user.email,
      user.credInfo.code,
      'confirm-registration?code',
    );
    await this.usersRepository.update(user);
    return true;
  }
}
