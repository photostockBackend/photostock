import { Injectable } from '@nestjs/common';
import { UserDomain } from './user.domain';
import { ProfileUserCreateType } from '../../user/types/profile-user-create.type';

@Injectable()
export class ProfileUserDomain {
  constructor(private profileDto: ProfileUserCreateType) {
    this.name = profileDto.name;
    this.surName = profileDto.surName;
    this.dateOfBirthday = profileDto.dateOfBirthday;
    this.city = profileDto.city;
    this.aboutMe = profileDto.aboutMe || '';
    this.userId = profileDto.userId;
  }
  id: number;
  username: string;
  name: string;
  surName: string;
  dateOfBirthday: Date;
  city: string;
  aboutMe: string;
  profilePhotoLink: string;
  user: UserDomain;
  userId: number;
}
