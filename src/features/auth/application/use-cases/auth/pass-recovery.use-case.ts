import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../../adapters/mail/mail.service';
import { AuthService } from '../../services/auth.service';
import { Inject } from '@nestjs/common';
import { IUsersRepo, USERS_REPO } from '../../../types/interfaces/i-users.repo';

export class PassRecoveryCommand {
  constructor(
    public readonly email: string,
    public readonly frontendAddress: string,
  ) {}
}
@CommandHandler(PassRecoveryCommand)
export class PassRecoveryUseCase
  implements ICommandHandler<PassRecoveryCommand>
{
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: PassRecoveryCommand): Promise<boolean> {
    const { email, frontendAddress } = command;
    const user = await this.usersRepository.findOneByFilter({
      email: email,
      credInfo: { isActivated: true },
    });
    if (!user) return false;
    await user.updCode();
    await this.mailService.sendEmail(
      frontendAddress,
      user.email,
      user.credInfo.code,
      'auth/password-recovery?recoveryCode',
    );
    return await this.usersRepository.update(user);
  }
}
