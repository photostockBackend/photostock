import { PostDomain } from '../../../../core/domain/post.domain';
import { FindPostFilterType } from '../../../user/types/posts/find-post-filter.type';

export const COMMENTS_REPO = 'COMMENTS REPO';
export interface ICommentsRepo {
  create(post: PostDomain): Promise<number>;
  update(post: PostDomain): Promise<boolean>;
  delete(userId: number, postId: number): Promise<boolean>;
  findOne(filter: FindPostFilterType): Promise<PostDomain>;
}
