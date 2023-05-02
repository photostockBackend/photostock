import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IPostsUserRepo,
  POSTS_USER_REPO,
} from '../../../../user/types/interfaces/i-posts-user.repo';
import { CommentDomain } from '../../../../../core/domain/comment.domain';
import {
  COMMENTS_REPO,
  ICommentsRepo,
} from '../../../types/interfaces/i-comments.repo';

export class CreateCommentForPostCommand {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
    public readonly text: string,
  ) {}
}
@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostUseCase
  implements ICommandHandler<CreateCommentForPostCommand>
{
  constructor(
    @Inject(POSTS_USER_REPO) private postsRepository: IPostsUserRepo,
    @Inject(COMMENTS_REPO) private commentsRepository: ICommentsRepo,
  ) {}
  async execute(command: CreateCommentForPostCommand): Promise<number> {
    const { postId, text, userId } = command;
    const post = await this.postsRepository.findOne({ id: postId });
    if (!post) throw new NotFoundException();
    const comment = new CommentDomain({ postId, userId, text });
    return await this.commentsRepository.create(comment);
  }
}
