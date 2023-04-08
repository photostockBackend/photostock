import { Controller, Delete, HttpCode } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../../database/prisma.service';
import format = require('pg-format');

const tables = ['User', 'CredInfoUser', 'TokenInfoUser', 'ProfileInfoUser'];
@SkipThrottle()
@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(private prisma: PrismaService) {}

  @HttpCode(204)
  @Delete()
  async DeleteAll() {
    for (const table of tables) {
      const sql = format(`DELETE FROM %I`, table);
      await this.prisma.$queryRawUnsafe(sql);
    }
    return;
  }
}
