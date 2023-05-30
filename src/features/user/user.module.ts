import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../database/prisma.module';
import { UserProfileController } from './api/user-profile.controller';
import { AuthModule } from '../auth/auth.module';
import { CheckUserNameInterceptor } from './api/interceptor/check-user-name.interceptor';
import { UpdateProfileInfoUseCase } from './application/use-cases/profile/update-profile-info.use-case';
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
import { UpdateProfilePhotoUseCase } from './application/use-cases/profile/update-profile-photo.use-case';
import { FindPostsByUserIdHandler } from './application/queries/handlers/posts/find-posts-by-user-id.handler';
import { QueryTransformPipe } from '../../helpers/common/pipes/query-transform.pipe';
import { PaymentController } from './api/payments.controller';
import { PaymentModule } from '../../adapters/payment/payment.module';
import { StripeAttachCardUseCase } from './application/use-cases/payment/stripe-attach-card.use-case';
import { StripeCreateSubscriptionUseCase } from './application/use-cases/payment/stripe-create-subscription.use-case';
import { PaymentsQueryRepo } from './infrastructure/query.repositories/payments.query.repo';
import { PaymentsCommandRepo } from './infrastructure/command.repositories/payments.command.repo';
import { StripeWebhookSubscriptionUpdatedUseCase } from './application/use-cases/payment/stripe-webhook-subscriptionupdated.use-case';
import { POSTS_FILES_REPO } from './types/interfaces/i-posts-files.repo';
import { PostsFilesCommandRepo } from './infrastructure/command.repositories/posts-files.command.repo';
import { FindPostFileByIdHandler } from './application/queries/handlers/posts/find-post-file-by-id.handler';
import { UserPostsController } from './api/user-posts.controller';

const commands = [
  UpdateProfileInfoUseCase,
  UpdateProfilePhotoUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  StripeAttachCardUseCase,
  StripeCreateSubscriptionUseCase,
  StripeWebhookSubscriptionUpdatedUseCase,
];
const queries = [
  GetProfileForUserHandler,
  FindPostByIdHandler,
  FindPostsByUserIdHandler,
  FindPostFileByIdHandler,
];
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
  {
    provide: POSTS_FILES_REPO,
    useClass: PostsFilesCommandRepo,
  },
  UserProfileQueryRepo,
  UserPostsQueryRepo,
  PaymentsQueryRepo,
  PaymentsCommandRepo,
];
const strategies = [];
const guards = [];
const interceptors = [CheckUserNameInterceptor];
const pipes = [IntTransformPipe, QueryTransformPipe];

@Module({
  controllers: [UserProfileController, UserPostsController, PaymentController],
  imports: [CqrsModule, PrismaModule, AuthModule, FilesModule, PaymentModule],
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
