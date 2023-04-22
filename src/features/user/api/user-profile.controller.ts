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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { BearerAuthGuard } from '../../auth/api/guards/strategies/jwt.strategy';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  UpdateProfileInputModel,
  UpdateProfilePhotoInputModel,
} from '../types/profile/user-profile-input.models';
import { CheckUserNameInterceptor } from './interceptor/check-user-name.interceptor';
import { UpdateProfileInfoCommand } from '../application/use-cases/profile/update-profile-info.use-case';
import { ProfileUserViewModel } from '../types/profile/user-profile-view.models';
import { GetProfileUserCommand } from '../application/queries/handlers/profile/get-profile-for-user.handler';
import {
  CreatePostInputModel,
  QueryPostInputModel,
  UpdatePostInputModel,
} from '../types/posts/user-post-input.models';
import { CreatePostCommand } from '../application/use-cases/posts/create-post.use-case';
import { UpdatePostCommand } from '../application/use-cases/posts/update-post.use-case';
import { DeletePostCommand } from '../application/use-cases/posts/delete-post.use-case';
import { FindPostByIdCommand } from '../application/queries/handlers/posts/find-post-by-id.handler';
import {
  PostsUserWithPaginationViewModel,
  PostUserViewModel,
} from '../types/posts/user-post-view.models';
import { IntTransformPipe } from '../../../helpers/common/pipes/int-transform.pipe';
import { UpdateProfilePhotoCommand } from '../application/use-cases/profile/update-profile-photo.use-case';
import { parseFilePipeValidationsOptions } from '../../../helpers/common/pipes/options.constans/parse-file-pipe-validations.options.constant';
import { FindPostsByUserIdCommand } from '../application/queries/handlers/posts/find-posts-by-user-id.handler';
import { QueryTransformPipe } from '../../../helpers/common/pipes/query-transform.pipe';

@ApiTags('user')
@Controller('user')
export class UserProfileController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The profile get for current user-profile.',
    type: ProfileUserViewModel,
  })
  @ApiResponse({
    status: 401,
    description: 'The user-profile not identified.',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile for current user-profile doesnt exists.',
  })
  @UseGuards(BearerAuthGuard)
  @Get('profile')
  async getProfileForCurrentUser(@Req() req: RequestWithUser) {
    const result = await this.queryBus.execute<
      GetProfileUserCommand,
      Promise<ProfileUserViewModel>
    >(new GetProfileUserCommand(req.user.userId));
    if (!result) throw new NotFoundException();
    return result;
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully updated.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user-profile not identified.',
  })
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(CheckUserNameInterceptor)
  @Put('profile/info')
  async updateProfileInfo(
    @Req() req: RequestWithUser,
    @Body() updateProfileInputModel: UpdateProfileInputModel,
  ) {
    await this.commandBus.execute(
      new UpdateProfileInfoCommand(req.user.userId, updateProfileInputModel),
    );
    return;
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The profile photo has been successfully updated.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user-profile not identified.',
  })
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Put('profile/photo')
  async updateProfilePhoto(
    @Req() req: RequestWithUser,
    @Body() updateProfilePhotoInputModel: UpdateProfilePhotoInputModel,
    @UploadedFile(
      new ParseFilePipe(parseFilePipeValidationsOptions('avatar', 1000)),
    )
    file: Express.Multer.File,
  ) {
    await this.commandBus.execute(
      new UpdateProfilePhotoCommand(req.user.userId, file),
    );
    return;
  }

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
    @Query(new QueryTransformPipe()) query: QueryPostInputModel,
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
      new ParseFilePipe(parseFilePipeValidationsOptions('postPhoto', 1000)),
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
  @UseInterceptors(FileInterceptor('postPhoto'))
  @Put('post/:id')
  async updatePostForCurrentUser(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updatePostInputModel: UpdatePostInputModel,
    @UploadedFile(
      new ParseFilePipe(parseFilePipeValidationsOptions('postPhoto', 1000)),
    )
    file: Express.Multer.File,
  ) {
    await this.commandBus.execute(
      new UpdatePostCommand(req.user.userId, +id, file, updatePostInputModel),
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
}
