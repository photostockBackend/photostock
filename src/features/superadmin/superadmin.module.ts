import { Module } from '@nestjs/common';
import { SuperAdminResolver } from './api/superadmin.resolver';

@Module({
  imports: [],
  providers: [
    SuperAdminResolver,
  ],
  exports: [],
})
export class SuperAdminModule {}