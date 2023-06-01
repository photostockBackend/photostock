import { ProfileUserDomain } from '../../../../core/domain/profile-user.domain';

export const PROFILE_USER_REPO = 'PROFILE USER REPO';
export interface IProfileUserRepo {
  updateProfileInfo(profile: ProfileUserDomain): Promise<boolean>;
  findProfileByUserId(userId: number): Promise<ProfileUserDomain>;
}
