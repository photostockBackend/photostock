import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { ProfileUserViewModel } from '../../types/profile/user-profile-view.models';

@Injectable()
export class UserProfileQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findProfileUserByUserId(userId: number): Promise<ProfileUserViewModel> {
    const profile = await this.prisma.profileInfoUser.findUnique({
      where: { userId: userId },
      include: { profilePhoto: true, user: true },
    });
    if (!profile) return null;
    return {
      username: profile.user.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthday: profile.birthday,
      city: profile.city,
      aboutMe: profile.aboutMe,
      avatar: {
        original: profile.profilePhoto.origResolution,
        thumbnail: profile.profilePhoto.minResolution,
      },
    };
  }
}
