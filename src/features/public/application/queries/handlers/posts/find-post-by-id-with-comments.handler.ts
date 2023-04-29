import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicPostsQueryRepo } from '../../../../infrastructure/query.repositories/public-posts.query.repo';

export class FindPostByIdWithCommentsCommand {
  constructor(public readonly postId: number) {}
}
@QueryHandler(FindPostByIdWithCommentsCommand)
export class FindPostByIdWithCommentsHandler
  implements IQueryHandler<FindPostByIdWithCommentsCommand>
{
  constructor(private queryRepo: PublicPostsQueryRepo) {}
  async execute(query: FindPostByIdWithCommentsCommand) {
    const { postId } = query;
    return await this.queryRepo.findPostByIdWithNewestComments(postId);
  }
}
