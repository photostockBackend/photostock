import { Injectable } from '@nestjs/common';
import { PostUserCreateType } from '../../features/user/types/post-user.type';

@Injectable()
export class PostDomain {
  constructor(private postDto: PostUserCreateType) {
    this.description = postDto.description;
    this.postPhotoPhotoLink = postDto.link;
    this.userId = postDto.userId;
  }
  id: number;
  description: string;
  postPhotoPhotoLink: string;
  userId: number;
}
