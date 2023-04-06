export type FoundUserType = {
  id: number;
  email: string;
  createdAt: string;
  credInfo: {
    id: number;
    passwordHash: string;
    isActivated: boolean;
    code: string;
    codeExpiresAt: Date;
    recoveryIsUsed: boolean;
    userId: number;
  };
};
