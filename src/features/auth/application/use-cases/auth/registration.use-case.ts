import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDomain } from '../../../../../core/domain/user.domain';
import { MailService } from '../../../../../adapters/mail/mail.service';
import { AuthService } from '../../services/auth.service';
import { BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepo, USERS_REPO } from '../../../types/interfaces/i-users.repo';
import { RegistrationInputModel } from '../../../types/auth-input.models';

export class RegistrationCommand {
  constructor(
    public readonly userDto: RegistrationInputModel,
    public readonly frontendAddress: string,
  ) {}
}
@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: RegistrationCommand): Promise<void> {
    const { username, email, password } = command.userDto;
    const foundUser = await this.authService.findOneByFilter({
      email: email,
    });
    const foundUserByUsername = await this.authService.findOneByFilter({
      username: username,
    });
    if (
      foundUser &&
      foundUserByUsername &&
      foundUser.id !== foundUserByUsername.id
    )
      throw new BadRequestException({
        message: [
          {
            field: 'username',
            message: 'username already used',
          },
        ],
      });
    const passwordHash = await this.authService.getPassHash(password);
    const user = new UserDomain({
      username,
      email,
      passwordHash,
    });
    await this.mailService.sendEmail(
      command.frontendAddress,
      user.email,
      user.credInfo.code,
      'auth/confirm-email?code',
    );
    if (foundUser) {
      user.id = foundUser.id;
      await this.usersRepository.update(user);
    } else if (foundUserByUsername)
      throw new BadRequestException({
        message: [
          {
            field: 'username',
            message: 'username already used',
          },
        ],
      });
    else await this.usersRepository.create(user);
    return;
  }
}
