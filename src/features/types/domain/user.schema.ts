import { add } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FoundUserType, UserCreateType } from '../../auth/types/user.types';

@Injectable()
export class User {
  constructor(private userDto: UserCreateType) {
    this.passwordHash = userDto.passwordHash;
    this.email = userDto.email;
    this.createdAt = new Date().toISOString();
    this.emailConfirmationCode = uuidv4();
    this.emailExpirationTime = add(new Date(), { hours: 24 });
    this.emailIsConfirmed = false;
  }
  id: number;
  passwordHash: string;
  email: string;
  createdAt: string;
  emailConfirmationCode: string;
  emailExpirationTime: Date;
  emailIsConfirmed: boolean;

  async confirmEmail(): Promise<boolean> {
    if (
      this.emailExpirationTime <= new Date() ||
      this.emailIsConfirmed === true
    )
      return false;
    this.emailIsConfirmed = true;
    return true;
  }
  async updEmailCode(): Promise<void> {
    this.emailConfirmationCode = uuidv4();
    this.emailExpirationTime = add(new Date(), { hours: 24 });
  }
  async setPassHash(newPassHash: string): Promise<void> {
    this.passwordHash = newPassHash;
  }
  async getEmailIsConfirmed(): Promise<boolean> {
    return this.emailIsConfirmed;
  }
  async setAll(userDto: FoundUserType): Promise<void> {
    this.id = userDto.id;
    this.passwordHash = userDto.passwordHash;
    this.email = userDto.email;
    this.createdAt = userDto.createdAt;
    this.emailConfirmationCode = userDto.emailConfirmationCode;
    this.emailExpirationTime = userDto.emailExpirationTime;
    this.emailIsConfirmed = userDto.emailIsConfirmed;
  }
}
