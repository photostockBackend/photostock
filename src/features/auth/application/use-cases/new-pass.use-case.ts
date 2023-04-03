import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPassCommand } from './commands/new-pass.command';
import { AuthService } from '../services/auth.service';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';
import * as bcrypt from 'bcrypt';
import { AuthCommandRepo } from '../../infrastructure/command.repo';

@CommandHandler(NewPassCommand)
export class NewPassUseCase implements ICommandHandler<NewPassCommand> {
  /*constructor(
    private authService: AuthService,
    private usersRepository: UsersRepo,
  ) {}
  async execute(command: NewPassCommand): Promise<boolean> {
    const { recoveryCode, newPassword } = command.newPassDto;
    const user = await this.usersRepository.findOneByField(
      'code',
      recoveryCode,
    );
    if (!user) return false;
    const result = await user.confirmCode();
    if (!result) return false;
    const newPassHash = await this.authService.getPassHash(newPassword);
    await user.setPassHash(newPassHash);
    return await this.usersRepository.update(user);
  }*/
  constructor(
    private usersRepo: AuthCommandRepo,
  ) {}

  async execute(command: NewPassCommand){
    const passwordSalt = await bcrypt.genSalt(8)
    const passwordHash = await bcrypt.hash(command.newPassDto.newPassword, passwordSalt)
    return await this.usersRepo.newPassword(passwordHash, command.newPassDto.recoveryCode)
  }
}
