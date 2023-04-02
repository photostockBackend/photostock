import { add } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserCreateType } from '../../auth/types/user.types';
import { CredInfoUser } from './cred-info-user.schema';
import { TokenInfo } from './token-info.schema';

@Injectable()
export class User {
  constructor(private userDto: UserCreateType) {
    this.credInfo.passwordHash = userDto.passwordHash;
    this.email = userDto.email;
    this.createdAt = new Date().toISOString();
    this.credInfo.code = uuidv4();
    this.credInfo.codeExpiresAt = add(new Date(), { hours: 24 });
    this.credInfo.isActivated = false;
  }
  id: number;
  email: string;
  createdAt: string;
  credInfo: CredInfoUser;
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
    this.credInfo.codeExpiresAt = add(new Date(), { hours: 24 });
    this.credInfo.isActivated = false;
  }
  async setPassHash(newPassHash: string): Promise<void> {
    this.credInfo.passwordHash = newPassHash;
  }
  async getEmailIsConfirmed(): Promise<boolean> {
    return this.credInfo.isActivated;
  }
}
