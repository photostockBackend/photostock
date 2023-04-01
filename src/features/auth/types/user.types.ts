export type UserCreateType = {
  email: string;
  passwordHash: string;
};

export type FoundUserType = {
  id: number;

  passwordHash: string;

  email: string;

  createdAt: string;

  emailConfirmationCode: string;

  emailExpirationTime: Date;

  emailIsConfirmed: boolean;
};
