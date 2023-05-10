import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PostDomain } from '../../../../core/domain/post.domain';
import { IPostsUserRepo } from '../../types/interfaces/i-posts-user.repo';
import { FindPostFilterType } from '../../types/posts/find-post-filter.type';
import { UserDomain } from '../../../../core/domain/user.domain';

@Injectable()
export class PaymentsCommandRepo {
  constructor(private prisma: PrismaService) {}
  async create(postDto: PostDomain): Promise<number> {
    const result = await this.prisma.posts.create({
      data: {
        description: postDto.description,
        postPhotoLinks: postDto.postPhotoLinks,
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
        postPhotoLinks: post.postPhotoLinks,
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

  async findUserWithPaymentsByUserId(userId: number): Promise<UserDomain> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        credInfo: true,
        paymentsInfo: {
          include: {
            payments: true
          }
        }, 
      },
    });
    if (!foundUser) return null;
    const user = new UserDomain({
      username: foundUser.username,
      email: foundUser.email,
      passwordHash: foundUser.credInfo.passwordHash,
    });
    await user.setAll(foundUser);
    await user.setPayments(foundUser.paymentsInfo);
    return user;
  }
}
