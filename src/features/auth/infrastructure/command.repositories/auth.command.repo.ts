import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { UserDomain } from '../../../../core/domain/user.domain';
import { FindFilterUserType } from '../../types/find-filter-user.type';
import { IUsersRepo } from '../../types/interfaces/i-users.repo';

@Injectable()
export class AuthCommandRepo implements IUsersRepo {
  constructor(private prisma: PrismaService) {}

  async create(user: UserDomain): Promise<number> {
    const result = await this.prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        credInfo: {
          create: {
            passwordHash: user.credInfo.passwordHash,
            isActivated: user.credInfo.isActivated,
            code: user.credInfo.code,
            codeExpiresAt: user.credInfo.codeExpiresAt,
            recoveryIsUsed: user.credInfo.recoveryIsUsed,
          },
        },
        profileInfo: {
          create: {
            profilePhoto: {
              create: { origResolution: null, minResolution: null },
            },
          },
        },
      },
    });
    return result.id;
  }
  async update(user: UserDomain): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        credInfo: {
          update: {
            passwordHash: user.credInfo.passwordHash,
            code: user.credInfo.code,
            codeExpiresAt: user.credInfo.codeExpiresAt,
            isActivated: user.credInfo.isActivated,
          },
        },
      },
    });
    return !!result;
  }
  async findOneByFilter(
    filter: FindFilterUserType,
  ): Promise<UserDomain | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: filter,
      include: {
        credInfo: true,
      },
    });
    if (!foundUser) return null;
    const user = new UserDomain({
      username: foundUser.username,
      email: foundUser.email,
      passwordHash: foundUser.credInfo.passwordHash,
    });
    await user.setAll(foundUser);
    return user;
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.prisma.user.delete({
      where: {id: id}
    })
    console.log('result', result)
    return true
  }
}
