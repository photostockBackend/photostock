import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FilesService } from '../../adapters/files/files.service';

@Injectable()
export class AllDataService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async deleteAllData(): Promise<void> {
    await this.prisma.tokenInfoUser.deleteMany();
    await this.prisma.credInfoUser.deleteMany();
    await this.prisma.profileInfoUser.deleteMany();
    await this.prisma.user.deleteMany();
  }
}
