import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { BearerAuthGuard } from '../../auth/api/guards/strategies/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiResponse({
    status: 200,
    description: 'The profile get for current user.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @UseGuards(BearerAuthGuard)
  @Get('profile')
  async getProfileforCurrentUser(@Req() req: RequestWithUser) {
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(FileInterceptor("file", {}))
  @Post('profile')
  async createProfileForCurrentUser(
    @Req() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
          new MaxFileSizeValidator({ maxSize: 1024 * 100 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {

    const s3 = new S3Client({
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: process.env.YANDEX_CLOUD_STORAGE_ID,
        secretAccessKey: process.env.YANDEX_CLOUD_STORAGE_KEY,
      }
    })

    const bucketParams = {
      Bucket: 'photostock',
      Key: `content/user/${req.user.userId}/avatars/${req.user.userId}.png`,
      body: file.buffer,
    }

    const command = new PutObjectCommand(bucketParams)
    await s3.send(command)
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully updated.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @Put('profile')
  async updateProfileForCurrentUser(@Req() req: RequestWithUser) {
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user not identified.',
  })
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @Delete('profile')
  async deleteProfileForCurrentUser(@Req() req: RequestWithUser) {
    return;
  }
}
