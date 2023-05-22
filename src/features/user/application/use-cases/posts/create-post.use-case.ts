import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { Inject } from '@nestjs/common';
import { CreatePostInputModel } from '../../../types/posts/user-post-input.models';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../types/interfaces/i-posts-user.repo';
import { PostDomain } from '../../../../../core/domain/post.domain';
import { PostFileDomain } from '../../../../../core/domain/post-file.domain';
import {
  IPostsFilesRepo,
  POSTS_FILES_REPO,
} from '../../../types/interfaces/i-posts-files.repo';

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
    @Inject(POSTS_FILES_REPO) private postsFilesRepository: IPostsFilesRepo,
  ) {}

  async execute(command: CreatePostCommand): Promise<number> {
    const { description } = command.createPostInputModel;
    const userId = command.userId;
    const post = await PostDomain.makeInstanceWithoutId({
      description,
      userId,
    });
    const postId = await this.postsRepository.create(post);
    if (command.files.length > 0) {
      const postFiles = [];
      const filesLinks = await this.filesService.saveFiles(
        command.userId,
        command.files,
        'posts',
      );
      for (const f of filesLinks) {
        postFiles.push(
          await this.postsFilesRepository.createPostFile(
            await PostFileDomain.makeInstanceWithoutId({ ...f, postId }),
          ),
        );
      }
      post.postFiles = postFiles;
    }
    return postId;
  }
}
