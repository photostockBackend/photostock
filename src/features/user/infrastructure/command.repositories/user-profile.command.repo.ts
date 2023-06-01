import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { IProfileUserRepo } from '../../types/interfaces/i-profile-user.repo';
import { ProfileUserDomain } from '../../../../core/domain/profile-user.domain';
import { ProfilePhotoDomain } from '../../../../core/domain/profile-photo.domain';

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
  async updateProfilePhoto(profilePhoto: ProfilePhotoDomain): Promise<boolean> {
    const result = await this.prisma.profilePhotos.update({
      where: { id: profilePhoto.id },
      data: profilePhoto,
    });
    return !!result;
  }
  async findProfileByUserId(userId: number): Promise<ProfileUserDomain> {
    const foundProfile = await this.prisma.profileInfoUser.findUnique({
      where: { userId: userId },
    });
    return ProfileUserDomain.makeInstanceWithId(foundProfile);
  }
  async findProfilePhotoByProfileId(
    profileId: number,
  ): Promise<ProfilePhotoDomain> {
    const foundProfilePhoto = await this.prisma.profilePhotos.findUnique({
      where: { profileId: profileId },
    });
    return ProfilePhotoDomain.makeInstanceWithId(foundProfilePhoto);
  }
}
