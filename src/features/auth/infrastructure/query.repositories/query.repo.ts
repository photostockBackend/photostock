import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { AuthMeViewModel } from '../../types/auth-view.models';
import { UserDomain } from '../../../types/domain/user.schema';
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

  // TODO: make reusable func with field-variant
  async findOneByField(field: string, value: string): Promise<UserDomain> {
    const sql = format(
      `SELECT
        "id" as "userId", "email"
      FROM "User"
      WHERE %1$I = %2$L;`,
      field,
      value,
    );
    const user = await this.prisma.$queryRawUnsafe<UserDomain[]>(sql);
    if (!user.length) return null;
    return user[0];
  }

  async findOne(issuedAt, deviceId, userId): Promise<AuthMeViewModel> {
    const sql = format(
      `SELECT
                "id" as "userId",
                "email"
                FROM "User"
                WHERE "id" = %1$s;`,
      issuedAt,
      deviceId,
      userId,
    );
    const user = await this.prisma.$queryRawUnsafe<AuthMeViewModel[]>(sql);
    if (!user.length) return null;
    return user[0];
  }
}
