import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from '../../../../../adapters/files/files.service';
import { Inject } from '@nestjs/common';
import { CreatePostInputModel } from '../../../types/posts/user-post-input.models';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../types/interfaces/i-posts-user.repo';
import { PostDomain } from '../../../../../core/domain/post.domain';
import {
  IPostsFilesRepo,
  POSTS_FILES_REPO,
} from '../../../types/interfaces/i-posts-files.repo';
import { ClientProxy } from '@nestjs/microservices';

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
    @Inject('FILES_MICROSERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: CreatePostCommand): Promise<number> {
    const { description } = command.createPostInputModel;
    const userId = command.userId;
    const post = await PostDomain.makeInstanceWithoutId({
      description,
      userId,
    });
    const id = 1;
    console.log(await this.client.send({ role: 'item', cmd: 'get-by-id' }, id));
    const postId = await this.postsRepository.create(post);
    if (command.files.length > 0) {
      console.log(await this.client.connect());
      const bufferDto: { type: 'Buffer'; data: number[] }[] = command.files.map(
        (f) => f.buffer.toJSON(),
      );
      const result = await this.client.send(
        { role: 'file', cmd: 'save' },
        bufferDto,
      );
      console.log(result);
      /*const filesLinks = await this.filesService.saveFiles(
        command.userId,
        command.files,
        'posts',
      );
      for (const f of filesLinks) {
        await this.postsFilesRepository.createPostFile(
          await PostFileDomain.makeInstanceWithoutId({ ...f, postId }),
        );
      }*/
    }
    return postId;
  }
}
