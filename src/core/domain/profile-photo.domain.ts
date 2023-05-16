import {
  ProfilePhotoCreateType,
  ProfilePhotoFoundType,
} from '../../features/user/types/profile/profile-photo.types';

export class ProfilePhotoDomain {
  id: number;
  //profile: ProfileUserDomain;
  profileId: number;
  origResolution: string;
  minResolution: string;

  static async makeInstanceWithoutId(profilePhotoDto: ProfilePhotoCreateType) {
    const profilePhoto = new ProfilePhotoDomain();
    profilePhoto.profileId = profilePhotoDto.profileId;
    profilePhoto.origResolution = profilePhotoDto.origResolution;
    profilePhoto.minResolution = profilePhotoDto.minResolution;
    return profilePhoto;
  }
  static async makeInstanceWithId(profilePhotoDto: ProfilePhotoFoundType) {
    const profilePhoto = new ProfilePhotoDomain();
    profilePhoto.id = profilePhotoDto.id;
    profilePhoto.profileId = profilePhotoDto.profileId;
    profilePhoto.origResolution = profilePhotoDto.origResolution;
    profilePhoto.minResolution = profilePhotoDto.minResolution;
    return profilePhoto;
  }
}
