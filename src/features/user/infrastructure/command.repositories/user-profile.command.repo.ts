import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { ProfileUserDomain } from '../../../types/domain/profile-user.domain';
import { UserDomain } from '../../../types/domain/user.domain';
import { IProfileUserRepo } from '../../types/interfaces/i-profile-user.repo';

@Injectable()
export class UserProfileCommandRepo implements IProfileUserRepo {
  constructor(private prisma: PrismaService) {}
  async create(profile: ProfileUserDomain): Promise<number> {
    const result = await this.prisma.profileInfoUser.create({
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthday: profile.birthday,
        city: profile.city,
        aboutMe: profile.aboutMe,
        profilePhotoLink: profile.profilePhotoLink,
        user: { connect: { id: profile.userId } },
      },
    });
    return result.id;
  }
  async update(userWithProfile: UserDomain): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: { id: userWithProfile.id },
      data: {
        username: userWithProfile.username,
        profileInfo: {
          update: {
            firstName: userWithProfile.profile.firstName,
            lastName: userWithProfile.profile.lastName,
            birthday: userWithProfile.profile.birthday,
            city: userWithProfile.profile.city,
            aboutMe: userWithProfile.profile.aboutMe,
            profilePhotoLink: userWithProfile.profile.profilePhotoLink,
          },
        },
      },
    });
    return !!result;
  }
  async findUserWithProfileByUserId(userId: number): Promise<UserDomain> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { credInfo: true, profileInfo: true },
    });
    if (!foundUser) return null;
    const user = new UserDomain({
      username: foundUser.username,
      email: foundUser.email,
      passwordHash: foundUser.credInfo.passwordHash,
    });
    await user.setAll(foundUser);
    await user.setProfile(foundUser.profileInfo);
    return user;
  }
  /*async findByUserId(userId: number): Promise<ProfileUserDomain> {
    const foundProfile = await this.prisma.profileInfoUser.findUnique({
      where: {
        userId: userId,
      },
      include: { user: { include: { credInfo: true } } },
    });
    if (!foundProfile) return null;
    const profile = new ProfileUserDomain({
      name: foundProfile.name,
      surName: foundProfile.surName,
      dateOfBirthday: foundProfile.dateOfBirthday,
      city: foundProfile.city,
      aboutMe: foundProfile.aboutMe,
      profilePhotoLink: foundProfile.profilePhotoLink,
      userId: foundProfile.userId,
    });
    profile.id = foundProfile.id;
    const user = new UserDomain({
      username: foundProfile.user.username,
      email: foundProfile.user.email,
      passwordHash: foundProfile.user.credInfo.passwordHash,
    });
    await user.setAll(foundProfile.user);
    await profile.setUser(user);
    return profile;
  }*/
  async deleteByUserId(userId: number): Promise<boolean> {
    try {
      await this.prisma.profileInfoUser.delete({
        where: {
          userId: userId,
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
