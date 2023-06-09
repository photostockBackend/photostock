import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { Inject } from '@nestjs/common';
import { CreatePostInputModel } from '../../../types/posts/user-post-input.models';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../types/interfaces/i-posts-user.repo';
import { PostDomain } from '../../../../../core/domain/post.domain';

export class CreatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly files: Express.Multer.File[],
    public readonly createPostInputModel: CreatePostInputModel,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private filesService: FilesService,
    @Inject(POSTS_USER_REPO) private postsRepository: IPostsUserRepo,
  ) {}

  async execute(command: CreatePostCommand): Promise<number> {
    const { description } = command.createPostInputModel;

    let postPhotoLinks;
    if (command.files.length > 0) {
      const files = [];
      command.files.forEach((file) =>
        files.push(this.filesService.getFileWrapper(command.userId, file)),
      );
      postPhotoLinks = await this.filesService.saveFiles(files);
    }
    const userId = command.userId;
    const post = await PostDomain.makeInstanceWithoutId({
      description,
      postPhotoLinks,
      userId,
    });
    return await this.postsRepository.create(post);
  }
}
