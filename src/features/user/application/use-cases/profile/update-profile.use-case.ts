import { UpdateProfileInputModel } from '../../../types/profile/user-profile-input.models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { AuthService } from '../../../../auth/application/services/auth.service';
import { Inject } from '@nestjs/common';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../../types/interfaces/i-profile-user.repo';
import {
  IUsersRepo,
  USERS_REPO,
} from '../../../../auth/types/interfaces/i-users.repo';

export class UpdateProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly file: Express.Multer.File,
    public readonly updateProfileInputModel: UpdateProfileInputModel,
  ) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileUseCase
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(
    private filesService: FilesService,
    private authService: AuthService,
    @Inject(PROFILE_USER_REPO) private profileRepository: IProfileUserRepo,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: UpdateProfileCommand): Promise<void> {
    const { username, firstName, lastName, birthday, city, aboutMe } =
      command.updateProfileInputModel;
    const user = await this.profileRepository.findUserWithProfileByUserId(
      command.userId,
    );
    let link = user.profile.profilePhotoLink;
    if (command.file) {
      const filePath = `content/user/${command.userId}/avatars/${
        command.userId
      }.${command.file.mimetype.split('/')[1]}`;
      link = await this.filesService.saveFile(filePath, command.file);
    }
    user.username = username;
    await user.profile.setAllWithoutIdAndUser({
      firstName,
      lastName,
      birthday,
      city,
      aboutMe,
      profilePhotoLink: link,
    });
    await this.profileRepository.update(user);
  }
}
