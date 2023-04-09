import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../adapters/files/files.service';
import { CreateProfileInputModel } from '../../types/user-input.models';

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
  constructor(private filesService: FilesService) {}
  async execute(command: CreateProfileCommand): Promise<any> {
    const { userId, file } = command;
  }
}
