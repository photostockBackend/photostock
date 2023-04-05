import { UserDomain } from '../../../types/domain/user.domain';
import { FindFilterUserType } from '../find-filter-user.type';

export const USERS_REPO = 'USERS REPO';
export interface IUsersRepo {
  create(user: UserDomain): Promise<number>;
  update(user: UserDomain): Promise<boolean>;
  findOneByFilter(filter: FindFilterUserType): Promise<UserDomain | null>;
}
