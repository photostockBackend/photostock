import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicPostsQueryRepo } from '../../../../infrastructure/query.repositories/public-posts.query.repo';
import { PostWithNewestCommentsViewModel } from '../../../../types/posts-view.models';

export class FindPostByIdWithNewestCommentsCommand {
  constructor(public readonly postId: number) {}
}
@QueryHandler(FindPostByIdWithNewestCommentsCommand)
export class FindPostByIdWithNewestCommentsHandler
  implements IQueryHandler<FindPostByIdWithNewestCommentsCommand>
{
  constructor(private queryRepo: PublicPostsQueryRepo) {}
  async execute(
    query: FindPostByIdWithNewestCommentsCommand,
  ): Promise<PostWithNewestCommentsViewModel> {
    const { postId } = query;
    return await this.queryRepo.findPostByIdWithNewestComments(postId);
  }
}
