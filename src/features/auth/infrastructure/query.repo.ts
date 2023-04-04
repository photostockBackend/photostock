import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { AuthMeViewModel } from '../types/auth-view.models';
import format = require('pg-format');
import { UserDomain } from '../../types/domain/user.schema';

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
      `
        SELECT u.id, u.email, c."passwordHash", c."isActivated"
        FROM "User" u
        LEFT JOIN "CredInfoUser" c on u.id = c."userId"
        WHERE %1$I = %2$L;
      `, 
      field, value
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
      issuedAt, deviceId, userId,
    );
    const user = await this.prisma.$queryRawUnsafe<AuthMeViewModel[]>(sql);
    if (!user.length) return null;
    return user[0];
  }
}
