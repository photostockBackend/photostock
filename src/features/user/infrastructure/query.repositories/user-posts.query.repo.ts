import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';

@Injectable()
export class UserPostsQueryRepo {
  constructor(protected prisma: PrismaService) {}
}
