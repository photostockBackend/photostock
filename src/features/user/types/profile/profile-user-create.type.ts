export type ProfilePhoto = {
  id: number
  keys: {
    key: string;
    resolution: string;
  }[]
}

export type ProfileUserCreateType = {
  id: number;
  firstName: string;
  lastName: string;
  birthday: Date;
  city: string;
  aboutMe: string;
  profilePhoto: ProfilePhoto;
  userId: number;
};
