import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { ProfileFoundType } from '../../types/profile-found.type';
import { ProfileUserViewModel } from '../../types/user-profile-view.models';
import format = require('pg-format');

@Injectable()
export class UserProfileQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findProfileUserByUserId(userId: number): Promise<ProfileUserViewModel> {
    const sql = format(
      `SELECT
                "name",
                "surName", 
                "dateOfBirthday", 
                "city",
                "aboutMe",
                "profilePhotoLink",
                "User"."username",
                "userId"
                FROM "ProfileInfoUser"
                JOIN "User"
                ON "User"."id" = %1$s
                WHERE "ProfileInfoUser"."userId" = %1$s;`,
      userId,
    );
    const profile = await this.prisma.$queryRawUnsafe<ProfileFoundType[]>(sql);
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
