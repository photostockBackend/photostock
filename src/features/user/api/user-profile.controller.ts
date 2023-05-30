import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  ParseFilePipe,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { BearerAuthGuard } from '../../auth/api/guards/strategies/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileInputModel } from '../types/profile/user-profile-input.models';
import { CheckUserNameInterceptor } from './interceptor/check-user-name.interceptor';
import { UpdateProfileInfoCommand } from '../application/use-cases/profile/update-profile-info.use-case';
import { ProfileUserViewModel } from '../types/profile/user-profile-view.models';
import { GetProfileUserCommand } from '../application/queries/handlers/profile/get-profile-for-user.handler';
import { UpdateProfilePhotoCommand } from '../application/use-cases/profile/update-profile-photo.use-case';
import { parseFilePipeValidationsOptions } from '../../../helpers/common/pipes/options.constans/parse-file-pipe-validations.options.constant';

@ApiTags('user/profile')
@Controller('user/profile')
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
  @Get()
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
  @Put('/info')
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
  @Put('/photo')
  async updateProfilePhoto(
    @Req() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipe(parseFilePipeValidationsOptions('avatar', 1000, false)),
    )
    file: Express.Multer.File,
  ) {
    await this.commandBus.execute(
      new UpdateProfilePhotoCommand(req.user.userId, file),
    );
    return;
  }
}
