import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostUserViewModel } from '../../../../types/posts/user-post-view.models';
import { UserPostsQueryRepo } from '../../../../infrastructure/query.repositories/user-posts.query.repo';

export class FindPostByIdCommand {
  constructor(public readonly postId: number) {}
}
@QueryHandler(FindPostByIdCommand)
export class FindPostByIdHandler implements IQueryHandler<FindPostByIdCommand> {
  constructor(private queryRepo: UserPostsQueryRepo) {}
  async execute(query: FindPostByIdCommand): Promise<PostUserViewModel> {
    const { postId } = query;
    return await this.queryRepo.findPostById(postId);
  }
}
