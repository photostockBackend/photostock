import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { TokenInfo } from '../../../types/domain/token-info.schema';
import { ITokensInfoRepo } from '../../types/interfaces/i-tokens-info.repo';
import { FindFilterTokenInfoType } from '../../types/find-filter-token-info.type';
import { DeleteFilterTokenInfoType } from '../../types/delete-filter-token-info.type';

@Injectable()
export class TokenInfoCommandRepo implements ITokensInfoRepo {
  constructor(private prisma: PrismaService) {}
  async create(token: TokenInfo): Promise<number> {
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
  async update(token: TokenInfo): Promise<boolean> {
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
  ): Promise<TokenInfo | null> {
    const foundSession = await this.prisma.tokenInfoUser.findFirst({
      where: filter,
    });
    if (!foundSession) return null;
    const session = new TokenInfo({
      issuedAt: foundSession[0].issuedAt,
      expirationAt: foundSession[0].expirationAt,
      deviceId: foundSession[0].deviceId,
      deviceIp: foundSession[0].deviceIp,
      deviceName: foundSession[0].deviceName,
      userId: foundSession[0].userId,
    });
    session.id = foundSession[0].id;
    return session;
  }
  async deleteOneByFilter(filter: DeleteFilterTokenInfoType): Promise<boolean> {
    const result = await this.prisma.tokenInfoUser.deleteMany({
      where: filter,
    });
    if (result.count != 0) return false;
    return true;
  }
  async deleteAllExceptCurrentDeviceId(
    userId: number,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.prisma.tokenInfoUser.deleteMany({
      where: { userId: userId, NOT: { deviceId: deviceId } },
    });
    if (result.count != 0) return false;
    return true;
  }
}
