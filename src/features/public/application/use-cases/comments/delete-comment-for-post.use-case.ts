import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  COMMENTS_REPO,
  ICommentsRepo,
} from '../../../types/interfaces/i-comments.repo';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

export class DeleteCommentForPostCommand {
  constructor(
    public readonly commentId: number,
    public readonly userId: number,
  ) {}
}

@CommandHandler(DeleteCommentForPostCommand)
export class DeleteCommentForPostUseCase
  implements ICommandHandler<DeleteCommentForPostCommand>
{
  constructor(
    @Inject(COMMENTS_REPO) private commentsRepository: ICommentsRepo,
  ) {}
  async execute(command: DeleteCommentForPostCommand): Promise<void> {
    const { commentId, userId } = command;
    const comment = await this.commentsRepository.findOne({ id: commentId });
    if (comment.userId != userId) throw new ForbiddenException();
    const result = await this.commentsRepository.delete(commentId);
    if (!result) {
      throw new NotFoundException();
    }
    return;
  }
}
