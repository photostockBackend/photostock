import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';

@Injectable()
export class PublicCommentsCommandRepo {
  constructor(private prisma: PrismaService) {}
}
