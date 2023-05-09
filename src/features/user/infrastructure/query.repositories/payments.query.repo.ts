import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PostUserFoundType } from '../../types/posts/post-user.type';
import {
  PostsUserWithPaginationViewModel,
  PostUserViewModel,
} from '../../types/posts/user-post-view.models';
import { PaginatorDto } from '../../../../helpers/common/types/paginator.dto';
import format = require('pg-format');

@Injectable()
export class PaymentsQueryRepo {
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
    page: PaginatorDto,
  ): Promise<PostsUserWithPaginationViewModel> {
    const posts = await this.prisma.posts.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'asc' },
      skip: (page.pageNumber - 1) * page.pageSize,
      take: page.pageSize,
    });
    const postsCount = await this.prisma.posts.count({
      where: { userId: userId },
    });
    return {
      pagesCount: Math.ceil(postsCount / page.pageSize),
      page: page.pageNumber,
      pageSize: page.pageSize,
      totalCount: postsCount,
      posts: posts.map((post) => ({
        id: post.id,
        description: post.description,
        postPhotos: post.postPhotoLinks,
      })),
    };
  }
}
