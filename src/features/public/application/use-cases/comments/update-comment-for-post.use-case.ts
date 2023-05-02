import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import {
  COMMENTS_REPO,
  ICommentsRepo,
} from '../../../types/interfaces/i-comments.repo';

export class UpdateCommentForPostCommand {
  constructor(
    public readonly commentId: number,
    public readonly userId: number,
    public readonly text: string,
  ) {}
}
@CommandHandler(UpdateCommentForPostCommand)
export class UpdateCommentForPostUseCase
  implements ICommandHandler<UpdateCommentForPostCommand>
{
  constructor(
    @Inject(COMMENTS_REPO) private commentsRepository: ICommentsRepo,
  ) {}
  async execute(command: UpdateCommentForPostCommand): Promise<void> {
    const { commentId, userId, text } = command;
    const comment = await this.commentsRepository.findOne({ id: commentId });
    if (!comment) throw new NotFoundException();
    if (comment.userId != userId) throw new ForbiddenException();
    comment.text = text;
    await this.commentsRepository.update(comment);
    return;
  }
}
