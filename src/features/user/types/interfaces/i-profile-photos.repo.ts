import { ProfilePhotoDomain } from '../../../../core/domain/profile-photo.domain';

export const PROFILE_PHOTOS_REPO = 'PROFILE PHOTOS REPO';
export interface IProfilePhotosRepo {
  updateProfilePhoto(profilePhoto: ProfilePhotoDomain): Promise<boolean>;
  findProfilePhotoByProfileId(profileId: number): Promise<ProfilePhotoDomain>;
}
