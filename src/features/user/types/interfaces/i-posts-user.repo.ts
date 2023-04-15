import { PostDomain } from '../../../../core/domain/post.domain';

export const POSTS_USER_REPO = 'POSTS USER REPO';
export interface IPostsUserRepo {
  create(post: PostDomain): Promise<boolean>;
}
