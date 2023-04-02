import { RegistrationCommand } from './commands/registration.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../services/auth.service';
import { User } from '../../../types/domain/user.schema';
import { MailService } from '../../../../adapters/mail/mail.service';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    protected authService: AuthService,
    protected mailService: MailService,
    protected usersRepository: UsersRepo,
  ) {}
  async execute(command: RegistrationCommand): Promise<string> {
    const { email, password } = command.userDto;
    const passwordHash = await this.authService.getPassHash(password);
    const user = new User({
      email,
      passwordHash,
    });
    await this.mailService.sendEmail('', user.email, user.credInfo.code, ''); //todo add source/action
    await this.usersRepository.create(user);
    return;
  }
}
