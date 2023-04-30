import { Injectable } from '@nestjs/common';
import { UserDomain } from './user.domain';
import { ProfilePhoto, ProfileUserCreateType } from '../../features/user/types/profile/profile-user-create.type';
import { ProfileUserUpdateType } from '../../features/user/types/profile/profile-user-update.type';
import { PhotoLinks } from '../../features/user/types/profile/user-profile-view.models';

@Injectable()
export class ProfileUserDomain {
  constructor(private profileDto: ProfileUserCreateType) {
    this.id = profileDto.id;
    this.firstName = profileDto.firstName;
    this.lastName = profileDto.lastName;
    this.birthday = profileDto.birthday;
    this.city = profileDto.city;
    this.aboutMe = profileDto.aboutMe;
    this.profilePhoto = profileDto.profilePhoto;
    this.userId = profileDto.userId;
  }
  id: number;
  firstName: string;
  lastName: string;
  birthday: Date;
  city: string;
  aboutMe: string;
  profilePhoto: ProfilePhoto;
  user: UserDomain;
  userId: number;
  async setUser(user: UserDomain): Promise<void> {
    this.user = user;
  }
  async setProfileInfo(profileDto: ProfileUserUpdateType) {
    this.firstName = profileDto?.firstName;
    this.lastName = profileDto?.lastName;
    this.birthday = profileDto?.birthday;
    this.city = profileDto?.city;
    this.aboutMe = profileDto?.aboutMe;
  }
}
