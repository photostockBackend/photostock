import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../types/interfaces/i-posts-user.repo';

export class DeletePostCommand {
  constructor(public readonly userId: number, public readonly postId: number) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    @Inject(POSTS_USER_REPO) private postsRepository: IPostsUserRepo,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { userId, postId } = command;
    const result = await this.postsRepository.delete(userId, postId);
    if (!result) {
      throw new NotFoundException();
    }
  }
}
