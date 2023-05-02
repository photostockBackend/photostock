import { Injectable } from '@nestjs/common';
import {
  CommentCreateType,
  CommentFoundType,
} from '../../features/public/types/comment.types';
import { UserDomain } from './user.domain';
import { PostDomain } from './post.domain';

@Injectable()
export class CommentDomain {
  constructor(private commentDto: CommentCreateType) {
    this.text = commentDto.text;
    this.userId = commentDto.userId;
    this.postId = commentDto.postId;
  }
  id: number;
  text: string;
  createdAt: string;
  userId: number;
  user: UserDomain;
  postId: number;
  post: PostDomain;
  async setAll(commentDto: CommentFoundType) {
    this.id = commentDto.id;
    this.text = commentDto.text;
    this.userId = commentDto.userId;
    this.postId = commentDto.postId;
    this.createdAt = commentDto.createdAt;
  }
}
