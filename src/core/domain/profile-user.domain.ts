import { Injectable } from '@nestjs/common';
import { UserDomain } from './user.domain';
import {
  ProfileUserCreateType,
  ProfileUserFoundType,
} from '../../features/user/types/profile/profile-user-create.type';
import { ProfileUserUpdateType } from '../../features/user/types/profile/profile-user-update.type';
import { ProfilePhotoDomain } from './profile-photo.domain';

@Injectable()
export class ProfileUserDomain {
  id: number;
  firstName: string;
  lastName: string;
  birthday: Date;
  city: string;
  aboutMe: string;
  profilePhoto: ProfilePhotoDomain;
  user: UserDomain;
  userId: number;
  async setProfileInfo(profileDto: ProfileUserUpdateType) {
    this.firstName = profileDto?.firstName;
    this.lastName = profileDto?.lastName;
    this.birthday = profileDto?.birthday;
    this.city = profileDto?.city;
    this.aboutMe = profileDto?.aboutMe;
  }

  static async makeInstanceWithoutId(profileDto: ProfileUserCreateType) {
    const profile = new ProfileUserDomain();
    profile.firstName = profileDto.firstName;
    profile.lastName = profileDto.lastName;
    profile.birthday = profileDto.birthday;
    profile.city = profileDto.city;
    profile.aboutMe = profileDto.aboutMe;
    profile.profilePhoto = await ProfilePhotoDomain.makeInstanceWithoutId(
      profileDto.profilePhoto,
    );
    profile.userId = profileDto.userId;
    return profile;
  }
  static async makeInstanceWithId(profileDto: ProfileUserFoundType) {
    const profile = new ProfileUserDomain();
    profile.id = profileDto.id;
    profile.firstName = profileDto.firstName;
    profile.lastName = profileDto.lastName;
    profile.birthday = profileDto.birthday;
    profile.city = profileDto.city;
    profile.aboutMe = profileDto.aboutMe;
    profile.profilePhoto = await ProfilePhotoDomain.makeInstanceWithId(
      profileDto.profilePhoto,
    );
    profile.userId = profileDto.userId;
    return profile;
  }
}
