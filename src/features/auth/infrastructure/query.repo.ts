import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import format from 'pg-format';
import { AuthMeViewModel } from '../types/auth-view.models';

@Injectable()
export class AuthQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async authMe(userId: number): Promise<AuthMeViewModel> {
    const sql = format(
      `SELECT
                "id" as "userId",
                "email"
                FROM public."Users"
                WHERE "id" = %1$s;`,
      userId,
    );
    const user = await this.prisma.$queryRaw<AuthMeViewModel[]>`${sql}`;
    if (!user.length) return null;
    return user[0];
  }
}
