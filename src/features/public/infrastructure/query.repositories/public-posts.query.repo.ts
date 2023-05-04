import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { PostWithNewestCommentsViewModel } from '../../types/posts-view.models';

@Injectable()
export class PublicPostsQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findPostByIdWithNewestComments(
    id: number,
  ): Promise<PostWithNewestCommentsViewModel> {
    const post = await this.prisma.posts.findUnique({
      where: { id: id },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
          take: 3,
          include: {
            user: {
              include: { profileInfo: { include: { profilePhoto: true } } },
            },
          },
        },
      },
    });
    if (!post) return null;
    return {
      id: post.id,
      description: post.description,
      postPhotos: post.postPhotoLinks,
      newestComments: post.comments.map((c) => ({
        id: c.id,
        text: c.text,
        username: c.user.username,
        avatarId: c.user.profileInfo.profilePhoto.id,
      })),
    };
  }
}
