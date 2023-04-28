import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PaginatorDto } from '../../../../helpers/common/types/paginator.dto';
import { addPagination } from '../../../../helpers/paginator';

@Injectable()
export class PublicPostsQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findPostByIdWithComments(id: number, page: PaginatorDto) {
    const post = await this.prisma.posts.findUnique({
      where: { id: id },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
          skip: (page.pageNumber - 1) * page.pageSize,
          take: page.pageSize,
        },
      },
    });
    const commentsCountByPost = await this.prisma.comments.count({
      where: { postId: id },
    });
    if (!post) return null;
    const pagination = addPagination(
      commentsCountByPost,
      page.pageSize,
      page.pageNumber,
    );
    return {
      id: post.id,
      description: post.description,
      postPhotos: post.postPhotoLinks,
      comments: {
        pagination,
        items: post.comments.map((c) => ({
          id: c.id,
          text: c.text,
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
