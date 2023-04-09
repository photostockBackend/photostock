import { UserDomain } from '../../types/domain/user.domain';

export type ProfileUserCreateType = {
  name?: string;
  surName?: string;
  dateOfBirthday?: Date;
  city?: string;
  aboutMe?: string;
  profilePhotoLink?: string;
  userId: number;
  user: UserDomain;
};
