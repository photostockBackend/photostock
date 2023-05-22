import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { Inject } from '@nestjs/common';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../../types/interfaces/i-profile-user.repo';

export class UpdateProfilePhotoCommand {
  constructor(
    public readonly userId: number,
    public readonly file: Express.Multer.File,
  ) {}
}
@CommandHandler(UpdateProfilePhotoCommand)
export class UpdateProfilePhotoUseCase
  implements ICommandHandler<UpdateProfilePhotoCommand>
{
  constructor(
    private filesService: FilesService,
    @Inject(PROFILE_USER_REPO) private profileRepository: IProfileUserRepo,
  ) {}
  async execute(command: UpdateProfilePhotoCommand): Promise<void> {
    const { userId, file } = command;
    const profile = await this.profileRepository.findProfileByUserId(userId);
    let link = null;
    if (file) {
      /*const filePath = `content/user/${userId}/avatars/${userId}.${
        file.mimetype.split('/')[1]
      }`;*/
      link = await this.filesService.saveFiles(userId, [file], 'avatars');
    }
    profile.profilePhoto.origResolution = link;
    profile.profilePhoto.minResolution = link;
    await this.profileRepository.updateProfilePhoto(profile);
  }
}
