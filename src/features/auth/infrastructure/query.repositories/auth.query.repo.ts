import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { AuthMeViewModel } from '../../types/auth-view.models';
import format = require('pg-format');

@Injectable()
export class AuthQueryRepo {
  constructor(protected prisma: PrismaService) {}

  async getAuthMe(userId: number): Promise<AuthMeViewModel> {
    const sql = format(
      `SELECT
                "id" as "userId",
                "email"
                FROM "User"
                WHERE "id" = %1$s;`,
      userId,
    );
    const user = await this.prisma.$queryRawUnsafe<AuthMeViewModel[]>(sql);
    if (!user.length) return null;
    return user[0];
  }
}
