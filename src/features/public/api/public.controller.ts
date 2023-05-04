import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { PostsUserWithPaginationViewModel } from '../../user/types/posts/user-post-view.models';
import { QueryTransformPipe } from '../../../helpers/common/pipes/query-transform.pipe';
import { BearerAuthGuard } from '../../auth/api/guards/strategies/jwt.strategy';
import { IntTransformPipe } from '../../../helpers/common/pipes/int-transform.pipe';
import {
  CreateCommentInputModel,
  UpdateCommentInputModel,
} from '../types/comments-input.models';
import { CreateCommentForPostCommand } from '../application/use-cases/comments/create-comment-for-post.use-case';
import { UpdateCommentForPostCommand } from '../application/use-cases/comments/update-comment-for-post.use-case';
import { DeleteCommentForPostCommand } from '../application/use-cases/comments/delete-comment-for-post.use-case';
import { FindPostByIdWithNewestCommentsCommand } from '../application/queries/handlers/posts/find-post-by-id-with-newest-comments.handler';
import { FindCommentForPostCommand } from '../application/queries/handlers/comments/find-comment-for-post.handler';
import { CommentViewModel } from '../types/comments-view.models';
import { PaginatorDto } from '../../../helpers/common/types/paginator.dto';
import { FindCommentsForPostCommand } from '../application/queries/handlers/comments/find-comments-for-post.handler';
import { PostWithNewestCommentsViewModel } from '../types/posts-view.models';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}
  @ApiResponse({
    status: 200,
    description: 'The profile get for current user-profile.',
    type: PostWithNewestCommentsViewModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile for current user-profile doesnt exists.',
  })
  @Get('post/:postId')
  async getPostByIdWithComments(
    @Param('postId', new IntTransformPipe()) postId: number,
  ) {
    const result = await this.queryBus.execute<
      FindPostByIdWithNewestCommentsCommand,
      Promise<PostWithNewestCommentsViewModel>
    >(new FindPostByIdWithNewestCommentsCommand(postId));
    if (!result) throw new NotFoundException();
    return result;
  }
  @ApiQuery({
    name: 'pageNumber',
    schema: { type: 'integer', default: 1 },
    description: 'pageNumber is number of portions that should be returned',
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    schema: { type: 'integer', default: 8 },
    description: 'pageSize is portions size that should be returned',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'The posts by user.',
    type: PostsUserWithPaginationViewModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Posts doesnt exists.',
  })
  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId', new IntTransformPipe()) postId: number,
    @Query(new QueryTransformPipe()) query: PaginatorDto,
  ) {
    return await this.queryBus.execute<
      FindCommentsForPostCommand,
      Promise<PostsUserWithPaginationViewModel>
    >(new FindCommentsForPostCommand(postId, query));
  }
  @UseGuards(BearerAuthGuard)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('postId', new IntTransformPipe()) postId: number,
    @Body() commentDto: CreateCommentInputModel,
    @Req() req: RequestWithUser,
  ) {
    const commentId = await this.commandBus.execute<
      CreateCommentForPostCommand,
      Promise<number>
    >(
      new CreateCommentForPostCommand(postId, req.user.userId, commentDto.text),
    );
    return await this.queryBus.execute<
      FindCommentForPostCommand,
      Promise<CommentViewModel>
    >(new FindCommentForPostCommand(commentId));
  }
  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  @Put('/comments/:commentId')
  async updComment(
    @Param('commentId', new IntTransformPipe()) commentId: number,
    @Body() commentDto: UpdateCommentInputModel,
    @Req() req: RequestWithUser,
  ) {
    await this.commandBus.execute<UpdateCommentForPostCommand, Promise<void>>(
      new UpdateCommentForPostCommand(
        commentId,
        req.user.userId,
        commentDto.text,
      ),
    );
    return;
  }
  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  @Delete('/comments/:commentId')
  async deleteComment(
    @Param('id', new IntTransformPipe()) id: number,
    @Req() req: RequestWithUser,
  ) {
    await this.commandBus.execute<DeleteCommentForPostCommand, Promise<void>>(
      new DeleteCommentForPostCommand(id, req.user.userId),
    );
    return;
  }
}
