import { UserDomain } from './user.schema';
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
  }
  id: number;
  passwordHash: string;
  isActivated: boolean;
  code: string;
  codeExpiresAt: Date;
  user: UserDomain;
  userId: number;
}
