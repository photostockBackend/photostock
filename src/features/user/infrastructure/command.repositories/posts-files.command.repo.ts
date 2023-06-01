import { Injectable } from '@nestjs/common';
import { IPostsFilesRepo } from '../../types/interfaces/i-posts-files.repo';
import { PrismaService } from '../../../../database/prisma.service';
import { PostFileDomain } from '../../../../core/domain/post-file.domain';

@Injectable()
export class PostsFilesCommandRepo implements IPostsFilesRepo {
  constructor(private prisma: PrismaService) {}
  async createPostFile(file: PostFileDomain): Promise<number> {
    const result = await this.prisma.postFiles.create({
      data: {
        postId: file.postId,
        origResolution: file.origResolution,
        minResolution: file.minResolution,
        mimeType: file.mimeType,
      },
    });
    return result.id;
  }
  async deleteManyById(deletedFiles: number[]): Promise<boolean> {
    const result = await this.prisma.postFiles.deleteMany({
      where: { id: { in: deletedFiles } },
    });
    return !!result.count;
  }
}
