import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { UserDomain } from '../../../../core/domain/user.domain';
import { IProfileUserRepo } from '../../types/interfaces/i-profile-user.repo';
import { ProfileUserDomain } from '../../../../core/domain/profile-user.domain';

@Injectable()
export class UserProfileCommandRepo implements IProfileUserRepo {
  constructor(private prisma: PrismaService) {}
  async updateProfileInfo(profile: ProfileUserDomain): Promise<boolean> {
    const result = await this.prisma.profileInfoUser.update({
      where: { id: profile.id },
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthday: profile.birthday,
        city: profile.city,
        aboutMe: profile.aboutMe,
        //user: { update: { username: profile.user.username } },
      },
    });
    return !!result;
  }
  async updateProfilePhoto(profile: ProfileUserDomain): Promise<boolean> {
    const result = await this.prisma.profileInfoUser.update({
      where: { id: profile.id },
      data: { profilePhoto: {} },
    });
    return !!result;
  }
  async update(userWithProfile: UserDomain): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: {
        id: userWithProfile.id,
      },
      data: {
        username: userWithProfile.username,
        profileInfo: {
          update: {
            firstName: userWithProfile.profile.firstName,
            lastName: userWithProfile.profile.lastName,
            birthday: userWithProfile.profile.birthday,
            city: userWithProfile.profile.city,
            aboutMe: userWithProfile.profile.aboutMe,
            profilePhoto: {
              update: {
                keys: userWithProfile.profile.profilePhoto.keys[0]?.key
                  ? {
                      upsert: {
                        where: { id: 1 },
                        update: {
                          resolution: 'original',
                          key:
                            userWithProfile.profile.profilePhoto.keys[0]?.key ??
                            null,
                        },
                        create: {
                          resolution: 'original',
                          key:
                            userWithProfile.profile.profilePhoto.keys[0]?.key ??
                            null,
                        },
                      },
                    }
                  : {},
              },
            },
          },
        },
      },
    });
    return !!result;
  }
  async findUserWithProfileByUserId(userId: number): Promise<UserDomain> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        credInfo: true,
        profileInfo: {
          include: {
            profilePhoto: true,
          },
        },
      },
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
  async findProfileByUserId(userId: number): Promise<ProfileUserDomain> {
    const foundProfile = await this.prisma.profileInfoUser.findUnique({
      where: { userId: userId },
      include: { profilePhoto: true },
    });
    return ProfileUserDomain.makeInstanceWithId(foundProfile);
  }
}
