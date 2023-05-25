import { ProfileUserDomain } from '../../../../core/domain/profile-user.domain';
import { ProfilePhotoDomain } from '../../../../core/domain/profile-photo.domain';

export const PROFILE_USER_REPO = 'PROFILE USER REPO';
export interface IProfileUserRepo {
  updateProfileInfo(profile: ProfileUserDomain): Promise<boolean>;
  updateProfilePhoto(profilePhoto: ProfilePhotoDomain): Promise<boolean>;
  findProfileByUserId(userId: number): Promise<ProfileUserDomain>;
  findProfilePhotoByProfileId(profileId: number): Promise<ProfilePhotoDomain>;
}
