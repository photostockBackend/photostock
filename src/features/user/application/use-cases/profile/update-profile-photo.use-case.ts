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
    const profilePhoto =
      await this.profileRepository.findProfilePhotoByProfileId(profile.id);
    let link = [{ origResolution: null, minResolution: null }];
    if (file) {
      link = await this.filesService.saveFiles(userId, [file], 'avatars');
    }
    profilePhoto.origResolution = link[1].origResolution;
    profilePhoto.minResolution = link[1].minResolution;
    await this.profileRepository.updateProfilePhoto(profilePhoto);
  }
}
