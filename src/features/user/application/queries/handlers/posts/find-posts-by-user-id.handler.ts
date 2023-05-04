import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserPostsQueryRepo } from '../../../../infrastructure/query.repositories/user-posts.query.repo';
import { PostsUserWithPaginationViewModel } from '../../../../types/posts/user-post-view.models';
import { PaginatorDto } from '../../../../../../helpers/common/types/paginator.dto';

export class FindPostsByUserIdCommand {
  constructor(
    public readonly userId: number,
    public readonly querySearch: PaginatorDto,
  ) {}
}
@QueryHandler(FindPostsByUserIdCommand)
export class FindPostsByUserIdHandler
  implements IQueryHandler<FindPostsByUserIdCommand>
{
  constructor(private queryRepo: UserPostsQueryRepo) {}
  async execute(
    query: FindPostsByUserIdCommand,
  ): Promise<PostsUserWithPaginationViewModel> {
    const { userId, querySearch } = query;
    return await this.queryRepo.findPostsByUserId(userId, querySearch);
  }
}
