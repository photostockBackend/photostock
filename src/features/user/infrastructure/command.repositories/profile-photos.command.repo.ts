import { IProfilePhotosRepo } from '../../types/interfaces/i-profile-photos.repo';
import { ProfilePhotoDomain } from '../../../../core/domain/profile-photo.domain';
import { PrismaService } from '../../../../database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfilePhotosCommandRepo implements IProfilePhotosRepo {
  constructor(private prisma: PrismaService) {}
  async updateProfilePhoto(profilePhoto: ProfilePhotoDomain): Promise<boolean> {
    const result = await this.prisma.profilePhotos.update({
      where: { id: profilePhoto.id },
      data: profilePhoto,
    });
    return !!result;
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
