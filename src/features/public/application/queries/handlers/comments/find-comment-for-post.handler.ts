import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicCommentsQueryRepo } from '../../../../infrastructure/query.repositories/public-comments.query.repo';
import { CommentViewModel } from '../../../../types/comments-view.models';

export class FindCommentForPostCommand {
  constructor(public readonly commentId: number) {}
}
@QueryHandler(FindCommentForPostCommand)
export class FindCommentForPostHandler
  implements IQueryHandler<FindCommentForPostCommand>
{
  constructor(private queryRepo: PublicCommentsQueryRepo) {}
  async execute(query: FindCommentForPostCommand): Promise<CommentViewModel> {
    const { commentId } = query;
    return await this.queryRepo.findComment(commentId);
  }
}
