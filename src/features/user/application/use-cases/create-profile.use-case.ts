import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../adapters/files/files.service';
import { CreateProfileInputModel } from '../../types/user-input.models';
import { AuthService } from '../../../auth/application/services/auth.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ProfileUserDomain } from '../../../types/domain/profile-user.domain';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../types/interfaces/i-profile-user.repo';
import {
  IUsersRepo,
  USERS_REPO,
} from '../../../auth/types/interfaces/i-users.repo';

export class CreateProfileCommand {
  constructor(
    public readonly userId: number,
    public readonly file: Express.Multer.File,
    public readonly createProfileInputModel: CreateProfileInputModel,
  ) {}
}
@CommandHandler(CreateProfileCommand)
export class CreateProfileUseCase
  implements ICommandHandler<CreateProfileCommand>
{
  constructor(
    private filesService: FilesService,
    private authService: AuthService,
    @Inject(PROFILE_USER_REPO) private profileRepository: IProfileUserRepo,
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
  ) {}
  async execute(command: CreateProfileCommand): Promise<void> {
    const { username, name, surName, birthday, city, aboutMe } =
      command.createProfileInputModel;
    const user = await this.authService.findOneByFilter({ id: command.userId });
    if (!user) throw new UnauthorizedException();
    let link = '';
    if (command.file)
      link = await this.filesService.saveAvatar(command.userId, command.file);
    const profile = new ProfileUserDomain({
      name,
      surName,
      city,
      profilePhotoLink: link,
      dateOfBirthday: birthday,
      aboutMe,
      userId: command.userId,
    });
    if (username !== user.username) {
      user.username = username;
      await this.usersRepository.update(user);
    }
    await this.profileRepository.create(profile);
  }
}
