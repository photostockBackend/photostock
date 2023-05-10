import { add } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserCreateType } from '../../features/auth/types/user.types';
import { CredInfoUserDomain } from './cred-info-user.domain';
import { TokenInfoDomain } from './token-info.domain';
import { FoundUserType } from '../../features/auth/types/found-user.type';
import { ProfileUserDomain } from './profile-user.domain';
import { ProfileUserCreateType } from '../../features/user/types/profile/profile-user-create.type';
import { PaymentInfoCreateType } from '../../features/user/types/payments/payments-create.type';
import { PaymentDomain } from './payment.domain';

export enum emailRecoveryFlag {
  email = 'isActivated',
  recovery = 'recoveryIsUsed',
}
@Injectable()
export class UserDomain {
  constructor(private userDto: UserCreateType) {
    this.credInfo = new CredInfoUserDomain(userDto.passwordHash);
    this.username = userDto.username;
    this.email = userDto.email;
    this.createdAt = new Date().toISOString();
  }

  id: number;
  username: string;
  email: string;
  createdAt: string;
  credInfo: CredInfoUserDomain;
  profile: ProfileUserDomain;
  tokenInfo: TokenInfoDomain[];
  paymentsInfo: PaymentDomain[];

  async confirmCode(flag: emailRecoveryFlag): Promise<boolean> {
    if (
      this.credInfo.codeExpiresAt <= new Date() ||
      this.credInfo[flag] === true
    )
      return false;
    this.credInfo[flag] = true;
    return true;
  }
  async updCode(): Promise<void> {
    this.credInfo.code = uuidv4();
    this.credInfo.codeExpiresAt = add(new Date(), {
      hours: 24,
    });
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
    this.username = userDto.username;
    this.email = userDto.email;
    this.createdAt = userDto.createdAt;
    this.credInfo.id = userDto.credInfo.id;
    this.credInfo.code = userDto.credInfo.code;
    this.credInfo.codeExpiresAt = userDto.credInfo.codeExpiresAt;
    this.credInfo.isActivated = userDto.credInfo.isActivated;
    this.credInfo.userId = userDto.credInfo.userId;
    this.credInfo.recoveryIsUsed = userDto.credInfo.recoveryIsUsed;
  }
  async setProfile(profileDto: ProfileUserCreateType) {
    this.profile = new ProfileUserDomain(profileDto);
  }
  async setPayments(paymentDto: PaymentInfoCreateType[]) {
    this.paymentsInfo = paymentDto.map(p => new PaymentDomain(p))
  }
}
