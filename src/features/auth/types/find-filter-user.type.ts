export type FindFilterUserType = {
  id?: number;
  userName?: string;
  email?: string;
  createdAt?: string;
  credInfo?: {
    code?: string;
    isActivated?: boolean;
    recoveryIsUsed?: boolean;
  };
};
