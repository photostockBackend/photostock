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
    return {
      username: profile[0].username,
      name: profile[0].name,
      surName: profile[0].surName,
      birthday: profile[0].dateOfBirthday,
      city: profile[0].city,
      aboutMe: profile[0].aboutMe,
      profilePhotoLink: profile[0].profilePhotoLink,
    };
  }
}
