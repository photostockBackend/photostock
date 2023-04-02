import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepo } from '../../types/interfaces/users-repo.interface';
import { User } from '../../../types/domain/user.schema';
import { TokensInfoRepo } from '../../types/interfaces/tokens-info-repo.interface';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepo,
    private tokensInfoRepository: TokensInfoRepo,
  ) {}
  async getPassHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    return await this.generateHash(password, passwordSalt);
  }
  async findUserByField(field: string, value: any): Promise<User> {
    return await this.usersRepository.findOneByField(field, value);
  }
  async cechCredentials(email: string, password: string) {
    const user = await this.findUserByField('email', email);
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
    return !!(await this.tokensInfoRepository.findOne({
      issuedAt: payload.iat,
      deviceId: payload.deviceId,
      userId: payload.userId,
    }));
  }
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
