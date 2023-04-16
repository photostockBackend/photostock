import { PostDomain } from '../../../../core/domain/post.domain';

export const POSTS_USER_REPO = 'POSTS USER REPO';
export interface IPostsUserRepo {
  create(post: PostDomain): Promise<PostDomain>;
  update(post: PostDomain): Promise<boolean>;
  delete(userId: number, postId: number): Promise<boolean>;
  findOne(userId: number, postId: number): Promise<PostDomain>;
}
