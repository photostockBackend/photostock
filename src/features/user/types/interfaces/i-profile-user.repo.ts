import { UserDomain } from '../../../../core/domain/user.domain';
import { ProfileUserDomain } from '../../../../core/domain/profile-user.domain';

export const PROFILE_USER_REPO = 'PROFILE USER REPO';
export interface IProfileUserRepo {
  update(userWithProfile: UserDomain): Promise<boolean>;
  findUserWithProfileByUserId(userId: number): Promise<UserDomain | null>;
  updateProfileInfo(profile: ProfileUserDomain): Promise<boolean>;
  updateProfilePhoto(profile: ProfileUserDomain): Promise<boolean>;
  findProfileByUserId(userId: number): Promise<ProfileUserDomain>;
}
