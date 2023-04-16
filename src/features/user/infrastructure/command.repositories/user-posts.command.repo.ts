import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PostDomain } from '../../../../core/domain/post.domain';
import { IPostsUserRepo } from '../../types/interfaces/i-posts-user.repo';

@Injectable()
export class UserPostsCommandRepo implements IPostsUserRepo {
  constructor(private prisma: PrismaService) {}
  async create(postDto: PostDomain): Promise<PostDomain> {
    const createdPost = await this.prisma.posts.create({
      data: {
        description: postDto.description,
        postPhotoLink: postDto.postPhotoLink,
        user: { connect: { id: postDto.userId } },
      },
    });
    const post = new PostDomain(createdPost)
    post.setAll(createdPost)
    //TODO: need to return viewmodel
    return post;
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
      }
    })
    const res = await this.prisma.posts.findMany()
    return !!updatedPost.count
  }

  async delete(userId: number, postId: number): Promise<boolean> {
    const deletedPost = await this.prisma.posts.deleteMany({
      where: {
        id: postId,
        userId: userId,
      },
    })
    return !!deletedPost.count
  }

  async findOne(userId: number, postId: number): Promise<PostDomain> {
    const foundedPost = await this.prisma.posts.findFirst({
      where: {
        id: postId,
        userId: userId,
      },
    }) 
    if(!foundedPost) {
      return null
    }
    const post = new PostDomain(foundedPost)
    post.setAll(foundedPost)
    return post;
  }
}
