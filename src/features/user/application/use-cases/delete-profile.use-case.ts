import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../types/interfaces/i-profile-user.repo';
import { FilesService } from '../../../../adapters/files/files.service';

export class DeleteProfileCommand {
  constructor(public readonly userId: number) {}
}
@CommandHandler(DeleteProfileCommand)
export class DeleteProfileUseCase
  implements ICommandHandler<DeleteProfileCommand>
{
  constructor(
    private filesService: FilesService,
    @Inject(PROFILE_USER_REPO) private profileRepository: IProfileUserRepo,
  ) {}
  async execute(command: DeleteProfileCommand): Promise<void> {
    this.filesService.deleteAvatar(command.userId)
    const result = await this.profileRepository.deleteByUserId(command.userId);
    if(!result) {
      throw new BadRequestException({
        message: [
          {
            field: 'profile',
            message: 'profile is not exist',
          },
        ],
      });
    }
  }
}
