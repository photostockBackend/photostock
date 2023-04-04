import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';
import { UserDomain } from '../../../types/domain/user.schema';
import { TokensInfoRepo } from '../../types/interfaces/tokens-info-repo.interface';
import { AuthQueryRepo } from '../../infrastructure/query.repo';
import { AuthCommandRepo } from '../../infrastructure/command.repo';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: AuthCommandRepo,
    private tokensInfoRepository: AuthQueryRepo,
  ) {}
  
  async getPassHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    return await this.generateHash(password, passwordSalt);
  }

  async findUserByField(field: string, value: any): Promise<UserDomain | null> {
    return await this.usersRepository.findUserbyEmail(value);
  }

  async checkCredentials(email: string, password: string) {
    const user = await this.findUserByField('email', email);
    console.log('user', user)
    if (!user) return null;
    const passwordHash = await this.generateHash(
      password,
      user.credInfo.passwordHash.substring(0, 30),
    );
    const confirmed = user.credInfo.isActivated;
    if (!confirmed) return null;
    return user.credInfo.passwordHash === passwordHash ? user : null;
  }

  async getPayload(token: string) {
    return JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('ascii'),
    );
  }

  async checkPayloadRefreshToken(payload: any): Promise<boolean> {
    return !!(await this.usersRepository.findOne(
      payload.iat,
      payload.deviceId,
      payload.userId,
    ));
  }

  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
