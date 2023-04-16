import { Injectable } from '@nestjs/common';
import {
  PostUserCreateType,
  PostUserFoundType,
} from '../../features/user/types/posts/post-user.type';

@Injectable()
export class PostDomain {
  constructor(private postDto: PostUserCreateType) {
    this.description = postDto.description;
    this.postPhotoLink = postDto.postPhotoLink;
    this.userId = postDto.userId;
  }
  id: number;
  description: string;
  postPhotoLink: string;
  userId: number;

  setAll(postDto: PostUserFoundType) {
    this.id = postDto.id;
    this.description = postDto.description;
    this.postPhotoLink = postDto.postPhotoLink;
    this.userId = postDto.userId;
  }
}
