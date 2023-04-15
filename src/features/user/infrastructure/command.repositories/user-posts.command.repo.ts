import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PostDomain } from '../../../../core/domain/post.domain';
import { IPostsUserRepo } from '../../types/interfaces/i-posts-user.repo';

@Injectable()
export class UserPostsCommandRepo implements IPostsUserRepo {
  constructor(private prisma: PrismaService) {}
  async create(post: PostDomain): Promise<boolean> {
    
    const result = await this.prisma.posts.create({
      data: {
        description: post.description,
        postPhotoLink: post.postPhotoPhotoLink,
        user: { connect: { id: post.userId } },
      },
    });
    console.log('result', result)
    return true;
  }
}
