import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../../../database/prisma.service';
import {UserDomain} from '../../../types/domain/user.domain';
import {IProfileUserRepo} from '../../types/interfaces/i-profile-user.repo';

@Injectable()
export class UserProfileCommandRepo implements IProfileUserRepo {
  constructor(private prisma: PrismaService) {}
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
}
