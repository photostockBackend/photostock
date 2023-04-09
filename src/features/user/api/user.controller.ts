import {
  Body,
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
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { BearerAuthGuard } from '../../auth/api/guards/strategies/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileInputModel } from '../types/user-input.models';

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
  async getProfileForCurrentUser(@Req() req: RequestWithUser) {
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
  @UseInterceptors(FileInterceptor('file', {}))
  @Post('profile')
  async createProfileForCurrentUser(
    @Req() req: RequestWithUser,
    @Body() createProfileInputModel: CreateProfileInputModel,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1000 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
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
