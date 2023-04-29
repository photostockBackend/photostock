import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';

@Injectable()
export class PublicPostsQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findPostByIdWithNewestComments(id: number) {
    const post = await this.prisma.posts.findUnique({
      where: { id: id },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
          take: 3,
          include: { user: { include: { profileInfo: true } } },
        },
      },
    });
    if (!post) return null;
    return {
      id: post.id,
      description: post.description,
      postPhotos: post.postPhotoLinks,
      newestComments: {
        items: post.comments.map((c) => ({
          id: c.id,
          text: c.text,
          username: c.user.username,
          avatar: c.user.profileInfo.profilePhotoLink,
        })),
      },
    };
  }
  /*async findPostsByUserId(
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
  }*/
}
