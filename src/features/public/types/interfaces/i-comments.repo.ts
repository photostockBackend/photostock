import { CommentDomain } from '../../../../core/domain/comment.domain';
import { FindCommentFilterType } from '../comment.types';

export const COMMENTS_REPO = 'COMMENTS REPO';
export interface ICommentsRepo {
  create(comment: CommentDomain): Promise<number>;
  update(comment: CommentDomain): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findOne(filter: FindCommentFilterType): Promise<CommentDomain>;
}
