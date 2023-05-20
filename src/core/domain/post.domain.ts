import { Injectable } from '@nestjs/common';
import {
  PostUserCreateType,
  PostUserFoundType,
} from '../../features/user/types/posts/post-user.type';
import { PostFileDomain } from './post-file.domain';

@Injectable()
export class PostDomain {
  id: number;
  description: string;
  postFiles: PostFileDomain[];
  userId: number;

  static async makeInstanceWithoutId(postDto: PostUserCreateType) {
    const post = new PostDomain();
    post.description = postDto.description;
    post.postFiles = await Promise.all(
      postDto.postFiles.map(async (f) =>
        PostFileDomain.makeInstanceWithoutId(f),
      ),
    );
    post.userId = postDto.userId;
    return post;
  }
  static async makeInstanceWithId(postDto: PostUserFoundType) {
    const post = new PostDomain();
    post.id = postDto.id;
    post.description = postDto.description;
    post.postFiles = await Promise.all(
      postDto.postFiles.map(async (f) => PostFileDomain.makeInstanceWithId(f)),
    );
    post.userId = postDto.userId;
    return post;
  }
  async updatePostFiles(newFiles: PostFileDomain[], deletedFiles: number[]) {
    const files = this.postFiles.filter((f) => !deletedFiles.includes(f.id));
    this.postFiles = files.concat(newFiles);
  }
}
