import { UserDomain } from '../../../../core/domain/user.domain';

export const PROFILE_USER_REPO = 'PROFILE USER REPO';
export interface IProfileUserRepo {
  update(userWithProfile: UserDomain): Promise<boolean>;
  findUserWithProfileByUserId(userId: number): Promise<UserDomain | null>;
}
