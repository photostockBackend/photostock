import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { SessionsViewModels } from '../../types/sessions-view.models';
import { FoundSessionType } from '../../types/found-session.type';
import format = require('pg-format');

@Injectable()
export class TokenInfoQueryRepo {
  constructor(protected prisma: PrismaService) {}
  async findSessionsByUserId(userId: number): Promise<SessionsViewModels[]> {
    const sql = format(
      `SELECT
                "issuedAt",
                "deviceId", 
                "deviceIp", 
                "deviceName"
                FROM "TokenInfoUser"
                WHERE "id" = %1$s;`,
      userId,
    );
    const sessions = await this.prisma.$queryRawUnsafe<FoundSessionType[]>(sql);
    if (!sessions.length) return null;
    return sessions.map((s) => ({
      ip: s.deviceIp,
      title: s.deviceName,
      lastActiveDate: new Date(s.issuedAt * 1000).toISOString(),
      deviceId: s.deviceId,
    }));
  }
}
