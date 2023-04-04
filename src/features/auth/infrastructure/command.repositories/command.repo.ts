import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { User } from '../../../types/domain/user.schema';

@Injectable()
export class AuthCommandRepo {
  constructor(private prisma: PrismaService) {}

  async registration(user: User) {
    await this.prisma.user.create({
      data: {
        email: user.email,
        createdAt: user.createdAt,
        credInfo: {
          create: {
            passwordHash: user.credInfo.passwordHash,
            isActivated: user.credInfo.isActivated,
            code: user.credInfo.code,
            codeExpiresAt: user.credInfo.codeExpiresAt,
          },
        },
      },
    });

    return;
  }

  async login(session) {
    return;
  }

  async logout(userId: number, deviceId: string, issuedAt: number) {
    return;
  }

  async refreshToken(session: number, issuedAt: number, expiresAt: number) {
    return;
  }

  async passwordRecovery(email: string, code: string) {
    await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        credInfo: {
          update: {
            code: code,
          },
        },
      },
    });

    return;
  }

  async newPassword(passwordHash: string, recoveryCode: string) {
    await this.prisma.credInfoUser.updateMany({
      where: {
        code: recoveryCode,
      },
      data: {
        passwordHash: passwordHash,
      },
    });
    return;
  }

  async registrationConfirmation(code: string) {
    await this.prisma.credInfoUser.updateMany({
      where: {
        code: code,
      },
      data: {
        isActivated: true,
      },
    });
    return;
  }

  async registrationEmailResending(email: string, code: string) {
    await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        credInfo: {
          update: {
            code: code,
          },
        },
      },
    });
    return;
  }
}
