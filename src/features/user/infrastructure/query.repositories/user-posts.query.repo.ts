import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import {
  PostsUserWithPaginationViewModel,
  PostUserViewModel,
} from '../../types/posts/user-post-view.models';
import { PaginatorDto } from '../../../../helpers/common/types/paginator.dto';

@Injectable()
export class UserPostsQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findPostById(id: number): Promise<PostUserViewModel> {
    const post = await this.prisma.posts.findUnique({
      where: { id: id },
      include: { postFiles: true },
    });
    return {
      id: post.id,
      description: post.description,
      postPhotosId: post.postFiles.map((f) => f.id),
    };
  }
  async findPostsByUserId(
    userId: number,
    page: PaginatorDto,
  ): Promise<PostsUserWithPaginationViewModel> {
    const posts = await this.prisma.posts.findMany({
      where: { userId: userId },
      include: { postFiles: true },
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
        postPhotosId: post.postFiles.map((f) => f.id),
      })),
    };
  }
  async getPostFilesById(fileId: number) {
    const file = await this.prisma.postFiles.findUnique({
      where: { id: fileId },
    });
    return {
      id: file.id,
      original: file.origResolution,
      preview: file.minResolution,
    };
  }
}
