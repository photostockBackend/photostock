import { UpdateProfileInputModel } from '../../../types/profile/user-profile-input.models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { AuthService } from '../../../../auth/application/services/auth.service';
import { Inject } from '@nestjs/common';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../../types/interfaces/i-profile-user.repo';

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
    private filesService: FilesService,
    private authService: AuthService,
    @Inject(PROFILE_USER_REPO) private profileRepository: IProfileUserRepo,
  ) {}
  async execute(command: UpdateProfileInfoCommand): Promise<void> {
    const { username, firstName, lastName, birthday, city, aboutMe } =
      command.updateProfileInputModel;
    const user = await this.profileRepository.findUserWithProfileByUserId(
      command.userId,
    );
    user.username = username;
    await user.profile.setProfileInfo({
      firstName,
      lastName,
      birthday,
      city,
      aboutMe,
    });
    await this.profileRepository.update(user);
  }
}
