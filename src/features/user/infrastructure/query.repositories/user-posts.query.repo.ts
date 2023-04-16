import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PostUserFoundType } from '../../types/posts/post-user.type';
import { PostUserViewModel } from '../../types/posts/user-post-view.models';
import format = require('pg-format');

@Injectable()
export class UserPostsQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findPostById(id: number): Promise<PostUserViewModel> {
    const sql = format(
      `SELECT 
        "id",
        "description",
        "postPhotoLink"
        FROM "Posts"
        WHERE "id" = %1$s;`,
      id,
    );
    const post = await this.prisma.$queryRawUnsafe<PostUserFoundType[]>(sql);
    if (!post.length) return null;
    return {
      id: post[0].id,
      description: post[0].description,
      postPhoto: post[0].postPhotoLink,
    };
  }
}
