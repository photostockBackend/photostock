import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { Inject, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { CreatePostInputModel } from '../../../types/posts/user-post-input.models';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../types/interfaces/i-posts-user.repo';
import { PostDomain } from '../../../../../core/domain/post.domain';

export class UpdatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly postId: number,
    public readonly file: Express.Multer.File,
    public readonly createPostInputModel: CreatePostInputModel,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private filesService: FilesService,
    @Inject(POSTS_USER_REPO) private postsRepository: IPostsUserRepo,
  ) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const { description } = command.createPostInputModel;
    const foundedPost = await this.postsRepository.findOne(
      command.userId,
      command.postId,
    );
    if (!foundedPost) {
      throw new NotFoundException();
    }
    let postPhotoLink;
    if (command.file) {
      const filePath = `content/user/${command.userId}/posts/${v4()}.${
        command.file.mimetype.split('/')[1]
      }`;
      postPhotoLink = await this.filesService.saveFile(filePath, command.file);
      foundedPost.postPhotoLinks = postPhotoLink;
    }
    foundedPost.description = description;
    const post = new PostDomain(foundedPost);
    post.setAll(foundedPost);
    await this.postsRepository.update(post);
  }
}
