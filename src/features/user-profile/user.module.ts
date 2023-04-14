import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {PrismaModule} from '../../database/prisma.module';
import {UserProfileController} from './api/user-profile.controller';
import {AuthModule} from '../auth/auth.module';
import {CheckUserNameInterceptor} from './api/interceptor/check-user-name.interceptor';
import {CreateProfileUseCase} from './application/use-cases/create-profile.use-case';
import {UpdateProfileUseCase} from './application/use-cases/update-profile.use-case';
import {DeleteProfileUseCase} from './application/use-cases/delete-profile.use-case';
import {FilesModule} from '../../adapters/files/files.module';
import {UserProfileCommandRepo} from './infrastructure/command.repositories/user-profile.command.repo';
import {PROFILE_USER_REPO} from './types/interfaces/i-profile-user.repo';
import {GetProfileForUserHandler} from './application/queries/handlers/get-profile-for-user.handler';
import {UserProfileQueryRepo} from './infrastructure/query.repositories/user-profile.query.repo';

const commands = [
  CreateProfileUseCase,
  UpdateProfileUseCase,
  DeleteProfileUseCase,
];
const queries = [GetProfileForUserHandler];
const services = [];
const repositories = [
  {
    provide: PROFILE_USER_REPO,
    useClass: UserProfileCommandRepo,
  },
  UserProfileQueryRepo,
];
const strategies = [];
const guards = [];
const interceptors = [CheckUserNameInterceptor];

@Module({
  controllers: [UserProfileController],
  imports: [CqrsModule, PrismaModule, AuthModule, FilesModule],
  providers: [
    ...commands,
    ...queries,
    ...services,
    ...repositories,
    ...strategies,
    ...guards,
    ...interceptors,
  ],
})
export class UserModule {}
