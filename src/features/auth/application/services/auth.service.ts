import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDomain } from '../../../types/domain/user.domain';
import {
  ITokensInfoRepo,
  TOKEN_INFO_REPO,
} from '../../types/interfaces/i-tokens-info.repo';
import { FindFilterUserType } from '../../types/find-filter-user.type';
import { IUsersRepo, USERS_REPO } from '../../types/interfaces/i-users.repo';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPO) private usersRepository: IUsersRepo,
    @Inject(TOKEN_INFO_REPO) private tokenInfoRepository: ITokensInfoRepo,
  ) {}

  async getPassHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    return await this.generateHash(password, passwordSalt);
  }

  async findOneByFilter(
    filter: FindFilterUserType,
  ): Promise<UserDomain | null> {
    return await this.usersRepository.findOneByFilter(filter);
  }
  async checkCredentials(email: string, password: string) {
    const user = await this.findOneByFilter({ email: email });
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
    return !!(await this.tokenInfoRepository.findOneByFilter({
      issuedAt: payload.iat,
      deviceId: payload.deviceId,
      userId: payload.userId,
    }));
  }
  async findSession(deviceId: string): Promise<number | null> {
    const session = await this.tokenInfoRepository.findOneByFilter({
      deviceId: deviceId,
    });
    return session ? session.userId : null;
  }
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
