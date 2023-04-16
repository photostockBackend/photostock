import { Injectable } from '@nestjs/common';
import {
  FoundPostUserType,
  PostUserCreateType,
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

  setAll(postDto: FoundPostUserType) {
    this.id = postDto.id;
    this.description = postDto.description;
    this.postPhotoLink = postDto.postPhotoLink;
    this.userId = postDto.userId;
  }
}
