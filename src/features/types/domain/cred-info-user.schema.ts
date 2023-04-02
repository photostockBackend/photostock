import { User } from './user.schema';

export class CredInfoUser {
  id: number;
  passwordHash: string;
  isActivated: boolean;
  code: string;
  codeExpiresAt: Date;
  user: User;
  userId: number;
}
