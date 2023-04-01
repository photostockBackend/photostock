import { User } from '../../../types/domain/user.schema';

export interface UsersRepo {
  create(user: User): number;
  update(user: User): boolean;
  findOneByField(field: string, value: any): User;
  deleteById(id: number): boolean;
}
