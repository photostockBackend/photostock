import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';
import { User } from '../../../types/domain/user.schema';

@Injectable()
export class AuthService {
  constructor(protected usersRepository: UsersRepo) {}
  async getPassHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    return await this.generateHash(password, passwordSalt);
  }
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  async findUserByField(field: string, value: any): Promise<User> {
    return await this.usersRepository.findOneByField(field, value);
  }
}
