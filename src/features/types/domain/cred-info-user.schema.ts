import { UserDomain } from './user.schema';

export class CredInfoUser {
  id: number;
  passwordHash: string;
  isActivated: boolean;
  code: string;
  codeExpiresAt: number;
  user: UserDomain;
  userId: number;
}
