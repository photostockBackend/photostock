import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { AuthMeViewModel } from '../../types/auth-view.models';
import format = require('pg-format');
import { PaginatorArgs } from '../../../superadmin/dto/users.args';

@Injectable()
export class AuthQueryRepo {
  constructor(protected prisma: PrismaService) {}

  async getAuthMe(userId: number): Promise<AuthMeViewModel> {
    const sql = format(
      `SELECT
                "id" as "userId",
                "email",
                "username"
                FROM "User"
                WHERE "id" = %1$s;`,
      userId,
    );
    const user = await this.prisma.$queryRawUnsafe<AuthMeViewModel[]>(sql);
    if (!user.length) return null;
    return user[0];
  }

  async findAllUsersWithPagination(queryParams: PaginatorArgs): Promise<any> {
    const sql = format(
      `SELECT
                "id" as "userId", "email", "username"
                FROM "User"
                WHERE username LIKE $s
                ORDER %I
                LIMIT %s OFFSET %s;`,
      queryParams.searchUsernameTerm, queryParams.pageNumber, queryParams.pageSize, queryParams.pageNumber * queryParams.pageSize
    );
    const users = await this.prisma.$queryRawUnsafe<AuthMeViewModel[]>(sql);
    return {
      pageSize: queryParams.pageSize,
      pageNumber: queryParams.pageNumber,
      users: users,
    }
  }
}
