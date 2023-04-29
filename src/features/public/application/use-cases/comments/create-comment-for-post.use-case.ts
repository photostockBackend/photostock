import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../../user/types/interfaces/i-posts-user.repo';

export class CreateCommentForPostCommand {
  constructor(public readonly postId: number, public readonly text: string) {}
}
@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostUseCase
  implements ICommandHandler<CreateCommentForPostCommand>
{
  constructor(
    @Inject(POSTS_USER_REPO) private postsRepository: IPostsUserRepo,
  ) {}
  async execute(command: CreateCommentForPostCommand): Promise<number> {
    const { postId, text } = command;
    const post = await this.postsRepository.findOne({ id: postId });
    if (!post) throw new NotFoundException();
    return 1;
  }
}
