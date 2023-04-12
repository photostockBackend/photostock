import { ProfileUserDomain } from '../../../types/domain/profile-user.domain';

export const PROFILE_USER_REPO = 'PROFILE USER REPO';
export interface IProfileUserRepo {
  create(profile: ProfileUserDomain): Promise<number>;
  update(profile: ProfileUserDomain): Promise<boolean>;
  findByUserId(userId: number): Promise<ProfileUserDomain | null>;
  deleteByUserId(userId: number): Promise<boolean>;
}
