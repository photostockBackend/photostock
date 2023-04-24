import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { Inject, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { UpdatePostInputModel } from '../../../types/posts/user-post-input.models';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../types/interfaces/i-posts-user.repo';
import { PostDomain } from '../../../../../core/domain/post.domain';

export class UpdatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly postId: number,
    public readonly files: Express.Multer.File[],
    public readonly updatePostInputModel: UpdatePostInputModel,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private filesService: FilesService,
    @Inject(POSTS_USER_REPO) private postsRepository: IPostsUserRepo,
  ) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const { description } = command.updatePostInputModel;
    const foundedPost = await this.postsRepository.findOne(
      command.userId,
      command.postId,
    );
    if (!foundedPost) {
      throw new NotFoundException();
    }

    let postPhotoLinks = command.updatePostInputModel.existedPhotos;
    if (command.files.length > 0) {
      const filePaths = command.files.map((file) => `content/user/${command.userId}/posts/${v4()}.${file.mimetype.split('/')[1]}`)
      const newPostPhotoLinks = await this.filesService.saveFiles(filePaths, command.files)
      postPhotoLinks = [...postPhotoLinks, ...newPostPhotoLinks];
    }
    foundedPost.postPhotoLinks = postPhotoLinks;
    foundedPost.description = description;
    const post = new PostDomain(foundedPost);
    post.setAll(foundedPost);
    await this.postsRepository.update(post);
  }
}
