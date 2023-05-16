import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PostDomain } from '../../../../core/domain/post.domain';
import { IPostsUserRepo } from '../../types/interfaces/i-posts-user.repo';
import { FindPostFilterType } from '../../types/posts/find-post-filter.type';

@Injectable()
export class UserPostsCommandRepo implements IPostsUserRepo {
  constructor(private prisma: PrismaService) {}
  async create(post: PostDomain): Promise<number> {
    const result = await this.prisma.posts.create({
      data: {
        description: post.description,
        postFiles: { createMany: { data: post.postFiles } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: { connect: { id: post.userId } },
      },
    });
    return result.id;
  }

  async update(post: PostDomain): Promise<boolean> {
    const result = await this.prisma.posts.update({
      where: {
        id: post.id,
      },
      data: {
        description: post.description,
        postFiles: {
          updateMany: { where: { postId: post.id }, data: post.postFiles },
        },
        updatedAt: new Date().toISOString(),
      },
    });
    return !!result;
  }

  async delete(userId: number, postId: number): Promise<boolean> {
    const deletedPost = await this.prisma.posts.deleteMany({
      where: {
        id: postId,
        userId: userId,
      },
    });
    return !!deletedPost.count;
  }

  async findOne(filter: FindPostFilterType): Promise<PostDomain> {
    const foundedPost = await this.prisma.posts.findFirst({
      where: filter,
    });
    if (!foundedPost) {
      return null;
    }
    return PostDomain.makeInstanceWithId(foundedPost);
  }
}
