import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserPostsQueryRepo } from '../../../../infrastructure/query.repositories/user-posts.query.repo';
import { PostFileViewModel } from '../../../../types/posts/user-post-view.models';

export class FindPostFileByIdCommand {
  constructor(public readonly id: number) {}
}

@QueryHandler(FindPostFileByIdCommand)
export class FindPostFileByIdHandler
  implements IQueryHandler<FindPostFileByIdCommand>
{
  constructor(private queryRepo: UserPostsQueryRepo) {}
  async execute(query: FindPostFileByIdCommand): Promise<PostFileViewModel> {
    const { id } = query;
    return await this.queryRepo.getFileById(id);
  }
}
