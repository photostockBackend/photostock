import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { ProfileUserViewModel } from '../../types/user-profile-view.models';
import format = require('pg-format');

@Injectable()
export class UserProfileQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findProfileUserByUserId(userId: number) {
    const sql = format(
      `SELECT
                "name",
                "surName", 
                "dateOfBirthday", 
                "city",
                "aboutMe",
                "profilePhotoLink",
                "User"."username"
                FROM "ProfileInfoUser"
                JOIN "User"
                ON "User"."id" = %1$s
                WHERE "ProfileInfoUser"."id" = %1$s;`,
      userId,
    );
    const profile = await this.prisma.$queryRawUnsafe<ProfileUserViewModel[]>(
      sql,
    );
    if (!profile.length) return null;
    return profile[0];
  }
}
