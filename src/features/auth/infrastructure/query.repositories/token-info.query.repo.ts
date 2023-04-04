/*
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async findSessionsByUserId(userId: number) {
    const sessions = await this.dataSource.query(
      `SELECT
                "issuedAt",
                "deviceId", 
                "deviceIp", 
                "deviceName"
                FROM public."RefreshTokenMetas"
                WHERE "userId" = $1;`,
      [userId],
    );
    if (!sessions.length) return null;
    return sessions.map((s) => ({
      ip: s.deviceIp,
      title: s.deviceName,
      lastActiveDate: new Date(s.issuedAt * 1000).toISOString(),
      deviceId: s.deviceId,
    }));
  }
}
*/
