import { UserDomain } from '../../../types/domain/user.schema';

export interface UsersRepo {
  create(user: UserDomain): number;
  update(user: UserDomain): boolean;
  findOneByField(field: string, value: any): UserDomain;
  deleteById(id: number): boolean;
}
