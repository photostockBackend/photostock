import { RegistrationCommand } from './commands/registration.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../services/auth.service';
import { User } from '../../../types/domain/user.schema';
import { MailService } from '../../../../adapters/mail/mail.service';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';
import { AuthCommandRepo } from '../../infrastructure/command.repo';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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
    const user = new User({
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
    private usersRepo: AuthCommandRepo,
  ) {}

    async execute(command: RegistrationCommand){
      const passwordSalt = await bcrypt.genSalt(8)
      const passwordHash = await bcrypt.hash(command.userDto.password, passwordSalt)
      const { email, password } = command.userDto;
      const user = new User({
        email,
        passwordHash,
      });

      await this.usersRepo.registration(user)
      await this.mailService.sendEmail(command.frontendAdress, user.email, user.credInfo.code, 'confirm-email?code')
    }
}
