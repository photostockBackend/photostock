import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { Inject } from '@nestjs/common';
import { v4 } from 'uuid';
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
      const filePaths = command.files.map((file) => `content/user/${command.userId}/posts/${v4()}.${file.mimetype.split('/')[1]}`)
      postPhotoLinks = await this.filesService.saveFiles(filePaths, command.files);
    }
    const userId = command.userId;
    const post = new PostDomain({ description, postPhotoLinks, userId });
    return await this.postsRepository.create(post);
  }
}
