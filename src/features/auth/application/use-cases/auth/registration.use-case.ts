import { RegistrationCommand } from './commands/registration.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDomain } from '../../../../types/domain/user.schema';
import { MailService } from '../../../../../adapters/mail/mail.service';
import { AuthCommandRepo } from '../../../infrastructure/command.repositories/command.repo';
import * as bcrypt from 'bcrypt';
import { CredInfoUser } from '../../../../types/domain/cred-info-user.schema';

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  /*constructor(
    protected authService: AuthService,
    protected mailService: MailService,
    protected usersRepository: UsersRepo,
  ) {}
  async execute(command: RegistrationCommand): Promise<string> {
    const { email, password } = command.userDto;
    const passwordHash = await this.authService.getPassHash(password);
    const user = new UserDomain({
      email,
      passwordHash,
    });
    await this.mailService.sendEmail(command.frontendAdress, user.email, user.credInfo.code, 'confirm-email?code'); 
    //this.usersRepository.create(user);
    this.usersRepository.registration(user)
    return;
  }*/
  constructor(
    protected mailService: MailService,
    private authRepo: AuthCommandRepo,
  ) {}

  async execute(command: RegistrationCommand) {
    const { email, password } = command.userDto;
    const passwordSalt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, passwordSalt);
    const user = new UserDomain(
      {
        email,
        passwordHash,
      },
      new CredInfoUser(),
    );
    await user.confirmCode();
    await this.authRepo.registration(user);
    await this.mailService.sendEmail(
      command.frontendAdress,
      user.email,
      user.credInfo.code,
      'confirm-email?code',
    );
  }
}
