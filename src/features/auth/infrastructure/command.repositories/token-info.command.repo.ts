import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { TokenInfoDomain } from '../../../../core/domain/token-info.domain';
import { ITokensInfoRepo } from '../../types/interfaces/i-tokens-info.repo';
import { FindFilterTokenInfoType } from '../../types/find-filter-token-info.type';
import { DeleteFilterTokenInfoType } from '../../types/delete-filter-token-info.type';

@Injectable()
export class TokenInfoCommandRepo implements ITokensInfoRepo {
  constructor(private prisma: PrismaService) {}
  async create(token: TokenInfoDomain): Promise<number> {
    const result = await this.prisma.tokenInfoUser.create({
      data: {
        issuedAt: token.issuedAt,
        expirationAt: token.expirationAt,
        deviceId: token.deviceId,
        deviceIp: token.deviceIp,
        deviceName: token.deviceName,
        user: { connect: { id: token.userId } },
      },
    });
    return result.id;
  }
  async update(token: TokenInfoDomain): Promise<boolean> {
    const result = await this.prisma.tokenInfoUser.update({
      where: { id: token.id },
      data: {
        issuedAt: token.issuedAt,
        expirationAt: token.expirationAt,
        deviceId: token.deviceId,
        deviceIp: token.deviceIp,
        deviceName: token.deviceName,
      },
    });
    return !!result;
  }
  async findOneByFilter(
    filter: FindFilterTokenInfoType,
  ): Promise<TokenInfoDomain | null> {
    const foundSession = await this.prisma.tokenInfoUser.findFirst({
      where: filter,
    });
    if (!foundSession) return null;
    const session = new TokenInfoDomain({
      issuedAt: foundSession.issuedAt,
      expirationAt: foundSession.expirationAt,
      deviceId: foundSession.deviceId,
      deviceIp: foundSession.deviceIp,
      deviceName: foundSession.deviceName,
      userId: foundSession.userId,
    });
    session.id = foundSession.id;
    return session;
  }
  async deleteOneByFilter(filter: DeleteFilterTokenInfoType): Promise<boolean> {
    const result = await this.prisma.tokenInfoUser.deleteMany({
      where: filter,
    });
    if (result.count !== 1) {
      console.log(filter, result);
      return false;
    }
    return true;
  }
  async deleteAllExceptCurrentDeviceId(
    userId: number,
    deviceId: string,
  ): Promise<boolean> {
    await this.prisma.tokenInfoUser.deleteMany({
      where: { userId: userId, NOT: { deviceId: deviceId } },
    });
    return true;
  }
}
