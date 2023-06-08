import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  PostFileViewModel,
  PostsUserWithPaginationViewModel,
  PostUserViewModel,
} from '../types/posts/user-post-view.models';
import { IntTransformPipe } from '../../../helpers/common/pipes/int-transform.pipe';
import { FindPostByIdCommand } from '../application/queries/handlers/posts/find-post-by-id.handler';
import { FindPostFileByIdCommand } from '../application/queries/handlers/posts/find-post-file-by-id.handler';
import { BearerAuthGuard } from '../../auth/api/guards/strategies/jwt.strategy';
import { QueryTransformPipe } from '../../../helpers/common/pipes/query-transform.pipe';
import { PaginatorDto } from '../../../helpers/common/types/paginator.dto';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { FindPostsByUserIdCommand } from '../application/queries/handlers/posts/find-posts-by-user-id.handler';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  CreatePostInputModel,
  UpdatePostInputModel,
} from '../types/posts/user-post-input.models';
import { parseFilePipeValidationsOptions } from '../../../helpers/common/pipes/options.constans/parse-file-pipe-validations.options.constant';
import { CreatePostCommand } from '../application/use-cases/posts/create-post.use-case';
import { UpdatePostCommand } from '../application/use-cases/posts/update-post.use-case';
import { DeletePostCommand } from '../application/use-cases/posts/delete-post.use-case';
import { TestMicro } from '../application/queries/handlers/posts/test-micro';

@ApiTags('user/post')
@Controller('user/post')
export class UserPostsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}
  @ApiResponse({
    status: 200,
    description: 'The post get by id.',
    type: PostUserViewModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Post doesnt exists.',
  })
  @Get('post/:id')
  async getPostById(@Param('id', new IntTransformPipe()) id: number) {
    const post = await this.queryBus.execute<
      FindPostByIdCommand,
      Promise<PostUserViewModel>
    >(new FindPostByIdCommand(id));
    if (!post) throw new NotFoundException();
    return post;
  }

  @ApiResponse({
    status: 200,
    description: 'The post file get by id.',
    type: PostFileViewModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Post file doesnt exists.',
  })
  @Get('post/file/:id')
  async getPostFileById(@Param('id', new IntTransformPipe()) id: number) {
    const file = await this.queryBus.execute<
      FindPostFileByIdCommand,
      Promise<PostFileViewModel>
    >(new FindPostFileByIdCommand(id));
    if (!file) throw new NotFoundException();
    return file;
  }

  @ApiBearerAuth()
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
  @UseGuards(BearerAuthGuard)
  @Get('post')
  async getPostsByUserId(
    @Query(new QueryTransformPipe()) query: PaginatorDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.queryBus.execute<
      FindPostsByUserIdCommand,
      Promise<PostsUserWithPaginationViewModel>
    >(new FindPostsByUserIdCommand(req.user.userId, query));
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @ApiConsumes('multipart/from-data')
  @HttpCode(201)
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(FilesInterceptor('postPhoto', 10))
  @Post('post')
  async createPostForCurrentUser(
    @Req() req: RequestWithUser,
    @Body() createPostInputModel: CreatePostInputModel,
    @UploadedFiles(
      new ParseFilePipe(
        parseFilePipeValidationsOptions('postPhoto', 1000, true),
      ),
    )
    files: Express.Multer.File[],
  ) {
    const postId = await this.commandBus.execute<
      CreatePostCommand,
      Promise<number>
    >(new CreatePostCommand(req.user.userId, files, createPostInputModel));
    return await this.queryBus.execute<
      FindPostByIdCommand,
      Promise<PostUserViewModel>
    >(new FindPostByIdCommand(postId));
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The post has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Too many photos for one post.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @ApiResponse({
    status: 404,
    description: 'The post for update did not found.',
  })
  @ApiConsumes('multipart/from-data')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(FilesInterceptor('postPhoto', 10))
  @Put('post/:id')
  async updatePostForCurrentUser(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updatePostInputModel: UpdatePostInputModel,
    @UploadedFiles(
      new ParseFilePipe(
        parseFilePipeValidationsOptions('postPhoto', 1000, false),
      ),
    )
    files: Express.Multer.File[],
  ) {
    await this.commandBus.execute(
      new UpdatePostCommand(req.user.userId, +id, files, updatePostInputModel),
    );
    return;
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @ApiResponse({
    status: 404,
    description: 'The post for delete did not found.',
  })
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @Delete('post/:id')
  async deletePostForCurrentUser(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    await this.commandBus.execute(new DeletePostCommand(req.user.userId, +id));
    return;
  }

  @Get(':id')
  async getMicro(@Param('id', new IntTransformPipe()) id: number) {
    return await this.queryBus.execute(new TestMicro(id));
  }
}
