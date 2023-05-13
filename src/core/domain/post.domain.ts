import { Injectable } from '@nestjs/common';
import {
  PostUserCreateType,
  PostUserFoundType,
} from '../../features/user/types/posts/post-user.type';

@Injectable()
export class PostDomain {
  id: number;
  description: string;
  postPhotoLinks: string[];
  userId: number;

  static async makeInstanceWithoutId(postDto: PostUserCreateType) {
    const post = new PostDomain();
    post.description = postDto.description;
    post.postPhotoLinks = postDto.postPhotoLinks;
    post.userId = postDto.userId;
    return post;
  }
  static async makeInstanceWithId(postDto: PostUserFoundType) {
    const post = new PostDomain();
    post.id = postDto.id;
    post.description = postDto.description;
    post.postPhotoLinks = postDto.postPhotoLinks;
    post.userId = postDto.userId;
    return post;
  }
}
