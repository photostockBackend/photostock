import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PostDomain } from '../../../../core/domain/post.domain';
import { IPostsUserRepo } from '../../types/interfaces/i-posts-user.repo';

@Injectable()
export class UserPostsCommandRepo implements IPostsUserRepo {
  constructor(private prisma: PrismaService) {}
  async create(postDto: PostDomain): Promise<number> {
    const result = await this.prisma.posts.create({
      data: {
        description: postDto.description,
        postPhotoLink: postDto.postPhotoLink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: { connect: { id: postDto.userId } },
      },
    });
    return result.id;
  }

  async update(post: PostDomain): Promise<boolean> {
    const updatedPost = await this.prisma.posts.updateMany({
      where: {
        id: post.id,
        userId: post.userId,
      },
      data: {
        description: post.description,
        postPhotoLink: post.postPhotoLink,
        updatedAt: new Date().toISOString(),
      },
    });
    return !!updatedPost.count;
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

  async findOne(userId: number, postId: number): Promise<PostDomain> {
    const foundedPost = await this.prisma.posts.findFirst({
      where: {
        id: postId,
        userId: userId,
      },
    });
    if (!foundedPost) {
      return null;
    }
    const post = new PostDomain({
      postPhotoLink: foundedPost.postPhotoLink,
      userId: foundedPost.userId,
      description: foundedPost.description,
    });
    post.id = foundedPost.id;
    return post;
  }
}
