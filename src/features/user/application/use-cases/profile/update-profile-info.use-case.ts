import { UpdateProfileInputModel } from '../../../types/profile/user-profile-input.models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../../types/interfaces/i-profile-user.repo';
import {
  IUsersRepo,
  USERS_REPO,
} from '../../../../auth/types/interfaces/i-users.repo';

export class UpdateProfileInfoCommand {
  constructor(
    public readonly userId: number,
    public readonly updateProfileInputModel: UpdateProfileInputModel,
  ) {}
}

@CommandHandler(UpdateProfileInfoCommand)
export class UpdateProfileInfoUseCase
  implements ICommandHandler<UpdateProfileInfoCommand>
{
  constructor(
    @Inject(PROFILE_USER_REPO) private profileRepository: IProfileUserRepo,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: UpdateProfileInfoCommand): Promise<void> {
    const { username, firstName, lastName, birthday, city, aboutMe } =
      command.updateProfileInputModel;
    const user = await this.usersRepository.findOneByFilter({
      id: command.userId,
    });
    const profile = await this.profileRepository.findProfileByUserId(
      command.userId,
    );
    user.username = username;
    await profile.setProfileInfo({
      firstName,
      lastName,
      birthday,
      city,
      aboutMe,
    });
    await this.profileRepository.updateProfileInfo(profile);
    await this.usersRepository.update(user);
  }
}
