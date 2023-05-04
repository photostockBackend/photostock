import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { ICommentsRepo } from '../../types/interfaces/i-comments.repo';
import { CommentDomain } from '../../../../core/domain/comment.domain';
import { FindCommentFilterType } from '../../types/comment.types';

@Injectable()
export class PublicCommentsCommandRepo implements ICommentsRepo {
  constructor(private prisma: PrismaService) {}
  async create(comment: CommentDomain): Promise<number> {
    const result = await this.prisma.comments.create({
      data: {
        text: comment.text,
        createdAt: comment.createdAt,
        post: { connect: { id: comment.postId } },
        user: { connect: { id: comment.userId } },
      },
    });
    return result.id;
  }
  async update(comment: CommentDomain): Promise<boolean> {
    const updatedComment = await this.prisma.comments.update({
      where: { id: comment.id },
      data: { text: comment.text },
    });
    return !!updatedComment;
  }
  async delete(id: number): Promise<boolean> {
    const deletedComment = await this.prisma.comments.delete({
      where: { id: id },
    });
    return !!deletedComment;
  }
  async findOne(filter: FindCommentFilterType): Promise<CommentDomain> {
    const foundedComment = await this.prisma.comments.findFirst({
      where: filter,
    });
    if (!foundedComment) return null;
    const comment = new CommentDomain({
      text: foundedComment.text,
      userId: foundedComment.userId,
      postId: foundedComment.postId,
    });
    await comment.setAll(foundedComment);
    return comment;
  }
}
