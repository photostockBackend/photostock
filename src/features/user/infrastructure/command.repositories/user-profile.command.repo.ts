import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { IProfileUserRepo } from '../../types/interfaces/i-profile-user.repo';
import { ProfileUserDomain } from '../../../../core/domain/profile-user.domain';

@Injectable()
export class UserProfileCommandRepo implements IProfileUserRepo {
  constructor(private prisma: PrismaService) {}
  async updateProfileInfo(profile: ProfileUserDomain): Promise<boolean> {
    const result = await this.prisma.profileInfoUser.update({
      where: { id: profile.id },
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthday: profile.birthday,
        city: profile.city,
        aboutMe: profile.aboutMe,
      },
    });
    return !!result;
  }
  async updateProfilePhoto(profile: ProfileUserDomain): Promise<boolean> {
    const result = await this.prisma.profileInfoUser.update({
      where: { id: profile.id },
      data: {
        profilePhoto: {
          update: {
            origResolution: profile.profilePhoto.origResolution,
            minResolution: profile.profilePhoto.minResolution,
          },
        },
      },
    });
    return !!result;
  }
  async findProfileByUserId(userId: number): Promise<ProfileUserDomain> {
    const foundProfile = await this.prisma.profileInfoUser.findUnique({
      where: { userId: userId },
      include: { profilePhoto: true },
    });
    return ProfileUserDomain.makeInstanceWithId(foundProfile);
  }
}
