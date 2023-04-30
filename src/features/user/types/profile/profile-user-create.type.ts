import { PhotoLinks } from "./user-profile-view.models";

export type ProfilePhoto = {
  id: number
  keys: PhotoLinks[]
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
