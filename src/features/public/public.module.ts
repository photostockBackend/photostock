import { Module } from '@nestjs/common';
import { PublicController } from './api/public.controller';
import { POSTS_USER_REPO } from '../user/types/interfaces/i-posts-user.repo';
import { UserPostsCommandRepo } from '../user/infrastructure/command.repositories/user-posts.command.repo';
import { IntTransformPipe } from '../../helpers/common/pipes/int-transform.pipe';
import { QueryTransformPipe } from '../../helpers/common/pipes/query-transform.pipe';
import { COMMENTS_REPO } from './types/interfaces/i-comments.repo';
import { PublicCommentsCommandRepo } from './infrastructure/command.repositories/public-comments.command.repo';
import { PublicCommentsQueryRepo } from './infrastructure/query.repositories/public-comments.query.repo';
import { PublicPostsQueryRepo } from './infrastructure/query.repositories/public-posts.query.repo';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../../adapters/files/files.module';
import { FindCommentForPostHandler } from './application/queries/handlers/comments/find-comment-for-post.handler';
import { FindCommentsForPostHandler } from './application/queries/handlers/comments/find-comments-for-post.handler';
import { FindPostByIdWithNewestCommentsHandler } from './application/queries/handlers/posts/find-post-by-id-with-newest-comments.handler';
import { CreateCommentForPostUseCase } from './application/use-cases/comments/create-comment-for-post.use-case';
import { UpdateCommentForPostUseCase } from './application/use-cases/comments/update-comment-for-post.use-case';
import { DeleteCommentForPostUseCase } from './application/use-cases/comments/delete-comment-for-post.use-case';

const commands = [
  CreateCommentForPostUseCase,
  UpdateCommentForPostUseCase,
  DeleteCommentForPostUseCase,
];
const queries = [
  FindPostByIdWithNewestCommentsHandler,
  FindCommentForPostHandler,
  FindCommentsForPostHandler,
];
const services = [];
const repositories = [
  {
    provide: COMMENTS_REPO,
    useClass: PublicCommentsCommandRepo,
  },

  {
    provide: POSTS_USER_REPO,
    useClass: UserPostsCommandRepo,
  },
  PublicCommentsQueryRepo,
  PublicPostsQueryRepo,
];
const strategies = [];
const guards = [];
const interceptors = [];
const pipes = [IntTransformPipe, QueryTransformPipe];

@Module({
  controllers: [PublicController],
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
export class PublicModule {}
