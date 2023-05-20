import { PostDomain } from '../../../../core/domain/post.domain';
import { FindPostFilterType } from '../posts/find-post-filter.type';
import { PostFileDomain } from '../../../../core/domain/post-file.domain';
import { PostFileCreateType } from '../posts/post-file.types';

export const POSTS_USER_REPO = 'POSTS USER REPO';
export interface IPostsUserRepo {
  create(post: PostDomain): Promise<number>;
  update(post: PostDomain): Promise<boolean>;
  delete(userId: number, postId: number): Promise<boolean>;
  findOne(filter: FindPostFilterType): Promise<PostDomain>;
  createPostFile(
    file: PostFileCreateType,
    postId: number,
  ): Promise<PostFileDomain>;
}
