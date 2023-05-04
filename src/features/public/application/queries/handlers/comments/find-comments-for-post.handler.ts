import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicCommentsQueryRepo } from '../../../../infrastructure/query.repositories/public-comments.query.repo';
import { CommentsByPostWithPaginationViewModel } from '../../../../types/comments-view.models';
import { PaginatorDto } from '../../../../../../helpers/common/types/paginator.dto';

export class FindCommentsForPostCommand {
  constructor(
    public readonly postId: number,
    public readonly querySearch: PaginatorDto,
  ) {}
}
@QueryHandler(FindCommentsForPostCommand)
export class FindCommentsForPostHandler
  implements IQueryHandler<FindCommentsForPostCommand>
{
  constructor(private queryRepo: PublicCommentsQueryRepo) {}
  async execute(
    query: FindCommentsForPostCommand,
  ): Promise<CommentsByPostWithPaginationViewModel> {
    const { postId, querySearch } = query;
    return await this.queryRepo.findCommentsByPost(postId, querySearch);
  }
}
