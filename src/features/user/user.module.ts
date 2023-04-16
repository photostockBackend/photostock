import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../database/prisma.module';
import { UserProfileController } from './api/user-profile.controller';
import { AuthModule } from '../auth/auth.module';
import { CheckUserNameInterceptor } from './api/interceptor/check-user-name.interceptor';
import { UpdateProfileUseCase } from './application/use-cases/profile/update-profile.use-case';
import { FilesModule } from '../../adapters/files/files.module';
import { UserProfileCommandRepo } from './infrastructure/command.repositories/user-profile.command.repo';
import { PROFILE_USER_REPO } from './types/interfaces/i-profile-user.repo';
import { GetProfileForUserHandler } from './application/queries/handlers/profile/get-profile-for-user.handler';
import { UserProfileQueryRepo } from './infrastructure/query.repositories/user-profile.query.repo';
import { CreatePostUseCase } from './application/use-cases/posts/create-post.use-case';
import { UserPostsCommandRepo } from './infrastructure/command.repositories/user-posts.command.repo';
import { POSTS_USER_REPO } from './types/interfaces/i-posts-user.repo';
import { UpdatePostUseCase } from './application/use-cases/posts/update-post.use-case';
import { DeletePostUseCase } from './application/use-cases/posts/delete-post.use-case';
import { IntTransformPipe } from '../../helpers/common/pipes/int-transform.pipe';
import { FindPostByIdHandler } from './application/queries/handlers/posts/find-post-by-id.handler';
import { UserPostsQueryRepo } from './infrastructure/query.repositories/user-posts.query.repo';

const commands = [
  UpdateProfileUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
];
const queries = [GetProfileForUserHandler, FindPostByIdHandler];
const services = [];
const repositories = [
  {
    provide: PROFILE_USER_REPO,
    useClass: UserProfileCommandRepo,
  },

  {
    provide: POSTS_USER_REPO,
    useClass: UserPostsCommandRepo,
  },
  UserProfileQueryRepo,
  UserPostsQueryRepo,
];
const strategies = [];
const guards = [];
const interceptors = [CheckUserNameInterceptor];
const pipes = [IntTransformPipe];

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
    ...pipes,
  ],
})
export class UserModule {}
