import { RegistrationCommand } from './commands/registration.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDomain } from '../../../../types/domain/user.schema';
import { MailService } from '../../../../../adapters/mail/mail.service';
import { AuthService } from '../../services/auth.service';
import { Inject } from '@nestjs/common';
import { IUsersRepo, USERS_REPO } from '../../../types/interfaces/i-users.repo';

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: RegistrationCommand): Promise<string> {
    const { email, password } = command.userDto;
    const passwordHash = await this.authService.getPassHash(password);
    const user = new UserDomain({
      email,
      passwordHash,
    });
    await this.mailService.sendEmail(
      command.frontendAddress,
      user.email,
      user.credInfo.code,
      'confirm-email?code',
    );
    await this.usersRepository.create(user);
    return;
  }
}
