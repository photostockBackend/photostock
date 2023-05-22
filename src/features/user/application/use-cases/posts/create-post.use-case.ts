import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { Inject } from '@nestjs/common';
import { CreatePostInputModel } from '../../../types/posts/user-post-input.models';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../types/interfaces/i-posts-user.repo';
import { PostDomain } from '../../../../../core/domain/post.domain';
import { PostFileCreateType } from '../../../types/posts/post-file.types';
import {PostFileDomain} from "../../../../../core/domain/post-file.domain";
import {IPostsFilesRepo, POSTS_FILES_REPO} from "../../../types/interfaces/i-posts-files.repo";

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
    //let postFiles: PostFileCreateType[] = [];
    if (command.files.length > 0) {
      const postFilesLinks = await this.filesService.saveFiles(
        command.userId,
        command.files,
        'posts',
      );
      const postFiles: PostFileDomain[] = [];
      postFilesLinks.forEach((f) => PostFileDomain.)
    }
    const userId = command.userId;
    const post = await PostDomain.makeInstanceWithoutId({
      description,
      userId,
    });
    const postId = await this.postsRepository.create(post);
    if (command.files.length > 0) {
      const postFilesLinks = await this.filesService.saveFiles(
          command.userId,
          command.files,
          'posts',
      );
      const postFiles: PostFileDomain[] = [];
      postFilesLinks.forEach((f) => PostFileDomain.)
    }
    return postId;
  }
}
