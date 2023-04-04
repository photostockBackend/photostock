import { add } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserCreateType } from '../../auth/types/user.types';
import { CredInfoUserDomain } from './cred-info-user.schema';
import { TokenInfo } from './token-info.schema';
import { FoundUserType } from '../../auth/types/found-user.type';

@Injectable()
export class UserDomain {
  constructor(private userDto: UserCreateType) {
    this.credInfo = new CredInfoUserDomain(userDto.passwordHash);
    this.email = userDto.email;
    this.createdAt = new Date().toISOString();
  }

  id: number;
  email: string;
  createdAt: string;
  credInfo: CredInfoUserDomain;
  tokenInfo: TokenInfo[];

  async confirmCode(): Promise<boolean> {
    if (
      this.credInfo.codeExpiresAt <= new Date() ||
      this.credInfo.isActivated === true
    )
      return false;
    this.credInfo.isActivated = true;
    return true;
  }
  async updCode(): Promise<void> {
    this.credInfo.code = uuidv4();
    this.credInfo.codeExpiresAt = add(new Date(), {
      hours: 24,
    });
    this.credInfo.isActivated = false;
  }
  async setPassHash(newPassHash: string): Promise<void> {
    this.credInfo.passwordHash = newPassHash;
  }
  async getEmailIsConfirmed(): Promise<boolean> {
    return this.credInfo.isActivated;
  }
  async setAll(userDto: FoundUserType) {
    this.id = userDto.id;
    this.credInfo.passwordHash = userDto.credInfo.passwordHash;
    this.email = userDto.email;
    this.createdAt = userDto.createdAt;
    this.credInfo.id = userDto.credInfo.id;
    this.credInfo.code = userDto.credInfo.code;
    this.credInfo.codeExpiresAt = userDto.credInfo.codeExpiresAt;
    this.credInfo.isActivated = userDto.credInfo.isActivated;
    this.credInfo.userId = userDto.credInfo.userId;
  }
}
