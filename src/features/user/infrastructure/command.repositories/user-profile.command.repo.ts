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
        name: profile.name,
        surName: profile.surName,
        dateOfBirthday: profile.dateOfBirthday,
        city: profile.city,
        aboutMe: profile.aboutMe,
        profilePhotoLink: profile.profilePhotoLink,
        user: { connect: { id: profile.userId } },
      },
    });
    return result.id;
  }
  async update(profile: ProfileUserDomain): Promise<boolean> {
    const result = await this.prisma.profileInfoUser.update({
      where: { id: profile.id },
      data: {
        name: profile.name,
        surName: profile.surName,
        dateOfBirthday: profile.dateOfBirthday,
        city: profile.city,
        aboutMe: profile.aboutMe,
        profilePhotoLink: profile.profilePhotoLink,
      },
    });
    return !!result;
  }
  async findByUserId(userId: number): Promise<ProfileUserDomain> {
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
  }
  async deleteByUserId(userId: number): Promise<boolean> {
    try {
      await this.prisma.profileInfoUser.delete({
        where: {
          userId: userId,
        },
      });
      return true
    } catch (e) {
      console.log(e);
      return false
    }
  }
}
