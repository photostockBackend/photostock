import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdatePostInputModel } from '../../../types/posts/user-post-input.models';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../types/interfaces/i-posts-user.repo';

export class UpdatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly postId: number,
    public readonly files: Express.Multer.File[],
    public readonly updatePostInputModel: UpdatePostInputModel,
  ) {}
}

/*
if(updatePostInputModel.existedPhotos && (updatePostInputModel.existedPhotos.length + files.length) > 10) {
      throw new BadRequestException({
        message: [
          {
            field: 'postPhoto & existedPhotos',
            message: 'a post can have no more than 10 photos in summ',
          },
        ],
      });
    }
*/

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private filesService: FilesService,
    @Inject(POSTS_USER_REPO) private postsRepository: IPostsUserRepo,
  ) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const { description } = command.updatePostInputModel;
    const foundedPost = await this.postsRepository.findOne({
      id: command.postId,
      user: { id: command.userId },
    });
    if (!foundedPost) {
      throw new NotFoundException();
    }

    const removedPhotoIds = command.updatePostInputModel.existedPhotos;

    //const removedLinks =  foundedPost.postPhotoLinks.filter(l => postPhotoLinks.every(l => inputL))
    let postPhotoLinks = command.updatePostInputModel.existedPhotos;
    if (command.files.length > 0) {
      const files = [];
      command.files.forEach((file) =>
        files.push(this.filesService.createFilePath(command.userId, file)),
      );

      const newPostPhotoLinks = await this.filesService.saveFiles(files);
      postPhotoLinks = [...postPhotoLinks, ...newPostPhotoLinks];
    }
    foundedPost.postPhotoLinks = postPhotoLinks;
    foundedPost.description = description;
    await this.postsRepository.update(foundedPost);

    // todo:  remove from
  }
}
