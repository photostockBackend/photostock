import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { UpdatePostInputModel } from '../../../types/posts/user-post-input.models';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../types/interfaces/i-posts-user.repo';
import { PostFileDomain } from '../../../../../core/domain/post-file.domain';

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
    const { remainingPhotos, deletedPhotos, description } =
      command.updatePostInputModel;
    if (remainingPhotos && remainingPhotos.length + command.files.length > 10) {
      throw new BadRequestException({
        message: [
          {
            field: 'postPhoto & existedPhotos',
            message: 'a post can have no more than 10 photos in sum',
          },
        ],
      });
    }
    const foundedPost = await this.postsRepository.findOne({
      id: command.postId,
      user: { id: command.userId },
    });
    if (!foundedPost) {
      throw new NotFoundException();
    }
    //deleting removed files from database
    await this.postsRepository.deletePostFiles(deletedPhotos);
    //deleting removed files from cloud
    const deletedFilesLinks = [];
    foundedPost.postFiles
      .filter((f) => deletedPhotos.includes(f.id))
      .forEach((f) => {
        deletedFilesLinks.push(f.minResolution);
        deletedFilesLinks.push(f.origResolution);
      });
    this.filesService.deleteFiles(deletedFilesLinks);
    let newPostFiles: PostFileDomain[] = [];
    if (command.files.length > 0) {
      const filesLinks = await this.filesService.saveFiles(
        command.userId,
        command.files,
        'posts',
      );
      newPostFiles = await Promise.all(
        filesLinks.map(async (f) =>
          this.postsRepository.createPostFile(f, command.postId),
        ),
      );
    }
    await foundedPost.updatePostFiles(newPostFiles, deletedPhotos);
    foundedPost.description = description;
    await this.postsRepository.update(foundedPost);
  }
}
