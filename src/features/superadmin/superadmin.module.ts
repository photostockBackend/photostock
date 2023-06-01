import { Module } from '@nestjs/common';
import { SuperAdminResolver } from './api/superadmin.resolver';
import { DeleteUserByAdminUseCase } from './application/delete-user-by-admin.command';
import { FindUsersByAdminUseCase } from './application/find-users-by-admin.query';
import { CqrsModule } from '@nestjs/cqrs';
import { USERS_REPO } from '../auth/types/interfaces/i-users.repo';
import { AuthCommandRepo } from '../auth/infrastructure/command.repositories/auth.command.repo';
import { PrismaModule } from '../../database/prisma.module';
import { ChangeUserStatusByAdminUseCase } from './application/change-user-status-by-admin.command';

const commands = [
  DeleteUserByAdminUseCase,
  ChangeUserStatusByAdminUseCase,
];
const queries = [
  FindUsersByAdminUseCase,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [
    SuperAdminResolver,
    {
      provide: USERS_REPO,
      useClass: AuthCommandRepo,
    },
    ...commands,
    ...queries,
  ],
  exports: [],
})
export class SuperAdminModule {}