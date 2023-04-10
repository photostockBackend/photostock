export type FindFilterUserType = {
  id?: number;
  username?: string;
  email?: string;
  createdAt?: string;
  credInfo?: {
    code?: string;
    isActivated?: boolean;
    recoveryIsUsed?: boolean;
  };
};
