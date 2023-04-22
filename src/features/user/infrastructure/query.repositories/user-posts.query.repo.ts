import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PostUserFoundType } from '../../types/posts/post-user.type';
import {
  PostsUserWithPaginationViewModel,
  PostUserViewModel,
} from '../../types/posts/user-post-view.models';
import { QueryPostInputModel } from '../../types/posts/user-post-input.models';
import format = require('pg-format');

@Injectable()
export class UserPostsQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findPostById(id: number): Promise<PostUserViewModel> {
    const sql = format(
      `SELECT 
        "id",
        "description",
        "postPhotoLinks"
        FROM "Posts"
        WHERE "id" = %1$s;`,
      id,
    );
    const post = await this.prisma.$queryRawUnsafe<PostUserFoundType[]>(sql);
    if (!post.length) return null;
    return {
      id: post[0].id,
      description: post[0].description,
      postPhotos: post[0].postPhotoLinks,
    };
  }
  async findPostsByUserId(
    userId: number,
    query: QueryPostInputModel,
  ): Promise<PostsUserWithPaginationViewModel> {
    const posts = await this.prisma.posts.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'asc' },
      skip: (query.pageNumber - 1) * query.pageSize,
      take: query.pageSize,
    });
    const postsCount = await this.prisma.posts.count({
      where: { userId: userId },
    });
    return {
      pagesCount: Math.ceil(postsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      posts: posts.map((post) => ({
        id: post.id,
        description: post.description,
        postPhotos: post.postPhotoLinks,
      })),
    };
  }
}
