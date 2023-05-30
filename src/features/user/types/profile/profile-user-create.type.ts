export type ProfileUserCreateType = {
  firstName: string;
  lastName: string;
  birthday: Date;
  city: string;
  aboutMe: string;
  userId: number;
};

export type ProfileUserFoundType = ProfileUserCreateType & {
  id: number;
};
