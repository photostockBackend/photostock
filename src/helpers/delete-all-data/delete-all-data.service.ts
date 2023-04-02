import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AllDataService {
  constructor(
    private prisma: PrismaService
  ) {}

  async deleteAllData(): Promise<void> {
    await this.prisma.user.deleteMany()
  }
  
}