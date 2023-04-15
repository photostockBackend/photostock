import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {PrismaModule} from '../../database/prisma.module';
import {UserProfileController} from './api/user-profile.controller';
import {AuthModule} from '../auth/auth.module';
import {CheckUserNameInterceptor} from './api/interceptor/check-user-name.interceptor';
import {UpdateProfileUseCase} from './application/use-cases/update-profile.use-case';
import {FilesModule} from '../../adapters/files/files.module';
import {UserProfileCommandRepo} from './infrastructure/command.repositories/user-profile.command.repo';
import {PROFILE_USER_REPO} from './types/interfaces/i-profile-user.repo';
import {GetProfileForUserHandler} from './application/queries/handlers/get-profile-for-user.handler';
import {UserProfileQueryRepo} from './infrastructure/query.repositories/user-profile.query.repo';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { UserPostsCommandRepo } from './infrastructure/command.repositories/user-posts.command.repo';
import { POSTS_USER_REPO } from './types/interfaces/i-posts-user.repo';

const commands = [
  UpdateProfileUseCase,
  CreatePostUseCase,
];
const queries = [GetProfileForUserHandler];
const services = [];
const repositories = [
  {
    provide: PROFILE_USER_REPO,
    useClass: UserProfileCommandRepo,
  },
  UserProfileQueryRepo,
  {
    provide: POSTS_USER_REPO,
    useClass: UserPostsCommandRepo,
  },
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
