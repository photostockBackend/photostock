import { UpdateProfileInputModel } from '../../types/user-profile-input.models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../adapters/files/files.service';
import { AuthService } from '../../../auth/application/services/auth.service';
import { BadRequestException, Inject } from '@nestjs/common';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../types/interfaces/i-profile-user.repo';
import {
  IUsersRepo,
  USERS_REPO,
} from '../../../auth/types/interfaces/i-users.repo';

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
    const { username, name, surName, birthday, city, aboutMe } =
      command.updateProfileInputModel;
    const profile = await this.profileRepository.findByUserId(command.userId);
    if (profile)
      throw new BadRequestException({
        message: [
          {
            field: 'profile',
            message: 'profile is not exist',
          },
        ],
      });
    const user = await this.authService.findOneByFilter({ id: command.userId });
    let link = '';
    if (command.file) {
      link = await this.filesService.saveAvatar(command.userId, command.file);
    }
    await profile.setAllWithoutIdAndUser({
      name,
      surName,
      dateOfBirthday: birthday,
      city,
      aboutMe,
      profilePhotoLink: link,
    });
    if (username !== user.username) {
      user.username = username;
      await this.usersRepository.update(user);
    }
    await this.profileRepository.update(profile);
  }
}
