import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../adapters/files/files.service';
import { CreateProfileInputModel } from '../../types/user-input.models';
import { AuthService } from '../../../auth/application/services/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { ProfileUserDomain } from '../../../types/domain/profile-user.domain';

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
  ) {}
  async execute(command: CreateProfileCommand): Promise<any> {
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
      user,
    });
    if (username !== user.username) profile.user.username = username;
    /*create profile*/
  }
}
