import { RegistrationCommand } from './commands/registration.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDomain } from '../../../../types/domain/user.domain';
import { MailService } from '../../../../../adapters/mail/mail.service';
import { AuthService } from '../../services/auth.service';
import { BadRequestException, Inject } from '@nestjs/common';
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
    const foundUser = await this.authService.findOneByFilter({ email: email });
    if (foundUser && foundUser.credInfo.isActivated)
      throw new BadRequestException({
        message: [
          {
            field: 'email',
            message: 'email already used',
          },
        ],
      });
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
    if (foundUser) {
      user.id = foundUser.id;
      await this.usersRepository.update(user);
    } else await this.usersRepository.create(user);
    return;
  }
}
