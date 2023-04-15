import { UpdateProfileInputModel } from '../../types/user-profile-input.models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../adapters/files/files.service';
import { AuthService } from '../../../auth/application/services/auth.service';
import { Inject } from '@nestjs/common';
import { v4 } from 'uuid';
import {
  IProfileUserRepo,
  PROFILE_USER_REPO,
} from '../../types/interfaces/i-profile-user.repo';
import {
  IUsersRepo,
  USERS_REPO,
} from '../../../auth/types/interfaces/i-users.repo';
import { CreatePostInputModel } from '../../types/user-post-input.models';
import { IPostsUserRepo } from '../../types/interfaces/i-posts-user.repo';
import { PostDomain } from '../../../../core/domain/post.domain';

export class CreatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly file: Express.Multer.File,
    public readonly createPostInputModel: CreatePostInputModel,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommand>
{
  constructor(
    private filesService: FilesService,
    @Inject(PROFILE_USER_REPO) private postsRepository: IPostsUserRepo,
  ) {}

  async execute(command: CreatePostCommand): Promise<void> {
    const { description } = command.createPostInputModel;

    let link
    if (command.file) {
      const filePath = `content/user/${command.userId}/posts/${v4()}.${command.file.mimetype.split('/')[1]}`
      link = await this.filesService.saveFile(filePath, command.file);
    }
    const userId = command.userId
    const post = new PostDomain({description, link, userId})
    await this.postsRepository.create(post)
  }
}
