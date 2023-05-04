export type CommentCreateType = {
  text: string;
  userId: number;
  postId: number;
};
export type CommentFoundType = {
  id: number;
  text: string;
  createdAt: string;
  postId: number;
  userId: number;
};
export type FindCommentFilterType = {
  id?: number;
  text?: string;
  postId?: number;
  userId?: number;
};
