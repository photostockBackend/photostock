import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import {
  CommentsByPostWithPaginationViewModel,
  CommentViewModel,
} from '../../types/comments-view.models';
import { PaginatorDto } from '../../../../helpers/common/types/paginator.dto';

@Injectable()
export class PublicCommentsQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findComment(id: number): Promise<CommentViewModel> {
    const comment = await this.prisma.comments.findUnique({
      where: { id: id },
      include: {
        user: { include: { profileInfo: true } },
      },
    });
    if (!comment) return null;
    return {
      id: comment.id,
      text: comment.text,
      username: comment.user.username,
      avatar: comment.user.profileInfo.profilePhotoLink,
    };
  }
  async findCommentsByPost(
    postId: number,
    page: PaginatorDto,
  ): Promise<CommentsByPostWithPaginationViewModel> {
    const comments = await this.prisma.comments.findMany({
      where: { postId: postId },
      include: { user: { include: { profileInfo: true } } },
      orderBy: { createdAt: 'asc' },
      skip: (page.pageNumber - 1) * page.pageSize,
      take: page.pageSize,
    });
    const commentsCount = await this.prisma.comments.count({
      where: {
        postId: postId,
      },
    });
    return {
      pagesCount: Math.ceil(commentsCount / page.pageSize),
      page: page.pageNumber,
      pageSize: page.pageSize,
      totalCount: commentsCount,
      comments: comments.map((c) => ({
        id: c.id,
        text: c.text,
        username: c.user.username,
        avatar: c.user.profileInfo.profilePhotoLink,
      })),
    };
  }
}
