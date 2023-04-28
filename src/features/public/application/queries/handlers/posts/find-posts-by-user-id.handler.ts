import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicPostsQueryRepo } from '../../../../infrastructure/query.repositories/public-posts.query.repo';
import { PostsUserWithPaginationViewModel } from '../../../../types/posts/user-post-view.models';
import { QueryPostInputModel } from '../../../../types/posts/user-post-input.models';

export class FindPostsByUserIdCommand {
  constructor(
    public readonly userId: number,
    public readonly querySearch: QueryPostInputModel,
  ) {}
}
@QueryHandler(FindPostsByUserIdCommand)
export class FindPostsByUserIdHandler
  implements IQueryHandler<FindPostsByUserIdCommand>
{
  constructor(private queryRepo: PublicPostsQueryRepo) {}
  async execute(
    query: FindPostsByUserIdCommand,
  ): Promise<PostsUserWithPaginationViewModel> {
    const { userId, querySearch } = query;
    return await this.queryRepo.findPostsByUserId(userId, querySearch);
  }
}
