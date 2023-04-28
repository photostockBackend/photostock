import { Controller, Get, NotFoundException, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ProfileUserViewModel } from '../../user/types/profile/user-profile-view.models';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { GetProfileUserCommand } from '../../user/application/queries/handlers/profile/get-profile-for-user.handler';
import { PostsUserWithPaginationViewModel } from '../../user/types/posts/user-post-view.models';
import { QueryTransformPipe } from '../../../helpers/common/pipes/query-transform.pipe';
import { QueryPostInputModel } from '../../user/types/posts/user-post-input.models';
import { FindPostsByUserIdCommand } from '../../user/application/queries/handlers/posts/find-posts-by-user-id.handler';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}
  @ApiResponse({
    status: 200,
    description: 'The profile get for current user-profile.',
    type: ProfileUserViewModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile for current user-profile doesnt exists.',
  })
  @Get('post/:postId')
  async getPostByIdWithComments(@Req() req: RequestWithUser) {
    const result = await this.queryBus.execute<
      GetProfileUserCommand,
      Promise<ProfileUserViewModel>
    >(new GetProfileUserCommand(req.user.userId));
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
    @Query(new QueryTransformPipe()) query: QueryPostInputModel,
    @Req() req: RequestWithUser,
  ) {
    return await this.queryBus.execute<
      FindPostsByUserIdCommand,
      Promise<PostsUserWithPaginationViewModel>
    >(new FindPostsByUserIdCommand(req.user.userId, query));
  }
  /*@UseGuards(BearerAuthGuard)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('id', new IntTransformPipe()) id: number,
    @Body() commentDto: CommentInputDto,
    @Req() req: RequestWithUser,
  ) {
    const commentId = await this.commandBus.execute<
      CreateCommentCommand,
      Promise<number>
    >(
      new CreateCommentCommand({
        content: commentDto.content,
        userId: req.user.userId,
        postId: id,
      }),
    );
    if (!commentId) throw new InternalServerErrorException();
    return await this.commentsQueryRepository.findCommentById(commentId);
  }
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckOwnerCommentInterceptor)
  @HttpCode(204)
  @Put(':postId/comments/:commentId')
  async updComment(
    @Param('id', new IntTransformPipe()) id: number,
    @Body() commentDto: CommentUpdateDto,
  ) {
    const result = await this.commandBus.execute<
      UpdateCommentCommand,
      Promise<boolean>
    >(new UpdateCommentCommand(id, commentDto));
    if (!result) throw new InternalServerErrorException();
    return;
  }*/
}
