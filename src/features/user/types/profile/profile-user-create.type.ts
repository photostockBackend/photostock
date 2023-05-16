import {
  ProfilePhotoCreateType,
  ProfilePhotoFoundType,
} from './profile-photo.types';

export type ProfileUserCreateType = {
  firstName: string;
  lastName: string;
  birthday: Date;
  city: string;
  aboutMe: string;
  profilePhoto: ProfilePhotoCreateType;
  userId: number;
};

export type ProfileUserFoundType = ProfileUserCreateType & {
  id: number;
  profilePhoto: ProfilePhotoFoundType;
};
