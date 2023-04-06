export type FindFilterUserType = {
  id?: number;
  email?: string;
  createdAt?: string;
  credInfo?: {
    code?: string;
    isActivated?: boolean;
    recoveryIsUsed?: boolean;
  };
};
