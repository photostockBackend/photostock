import { UserDomain } from './user.domain';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

export class CredInfoUserDomain {
  constructor(passwordHash: string) {
    this.passwordHash = passwordHash;
    this.code = uuidv4();
    this.codeExpiresAt = add(new Date(), {
      hours: 24,
    });
    this.isActivated = false;
    this.recoveryIsUsed = false;
  }
  id: number;
  passwordHash: string;
  isActivated: boolean;
  code: string;
  codeExpiresAt: Date;
  recoveryIsUsed: boolean;
  user: UserDomain;
  userId: number;
}
