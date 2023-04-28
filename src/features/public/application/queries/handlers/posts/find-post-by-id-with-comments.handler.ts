import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicPostsQueryRepo } from '../../../../infrastructure/query.repositories/public-posts.query.repo';
import { PaginatorDto } from '../../../../../../helpers/common/types/paginator.dto';

export class FindPostByIdWithCommentsCommand {
  constructor(
    public readonly postId: number,
    public readonly page: PaginatorDto,
  ) {}
}
@QueryHandler(FindPostByIdWithCommentsCommand)
export class FindPostByIdWithCommentsHandler
  implements IQueryHandler<FindPostByIdWithCommentsCommand>
{
  constructor(private queryRepo: PublicPostsQueryRepo) {}
  async execute(query: FindPostByIdWithCommentsCommand) {
    const { postId, page } = query;
    return await this.queryRepo.findPostByIdWithComments(postId, page);
  }
}
