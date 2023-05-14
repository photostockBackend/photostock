import {
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import RequestWithUser from '../../types/interfaces/request-with-user.interface';
import { SessionsViewModels } from '../types/sessions-view.models';
import { CheckOwnerDeviceInterceptor } from './interceptors/check.owner.device.interceptor';
import { DeleteSessionsExcludeCurrentCommand } from '../application/use-cases/devices-sessions/delete-sessions-exclude-current.use-case';
import { DeleteSessionCommand } from '../application/use-cases/devices-sessions/delete-session.use-case';
import { GetSessionCommand } from '../application/queries/sessions/handlers/get-sessions.handler';
import { RefreshAuthGuard } from './guards/strategies/refresh.strategy';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseError } from '../../../helpers/common/swagger-decorators/error-api-swagger';
import { ErrorSwagger } from '../../../helpers/common/types/errored';

@ApiTags('devices')
@Controller('/security/devices')
export class SecurityDevicesController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiResponse({
    status: 200,
    description: 'The user-profile has been successfully identified.',
    type: [SessionsViewModels],
  })
  @ApiResponse({
    status: 401,
    description: 'The user is not authorized.',
  })
  @UseGuards(RefreshAuthGuard)
  @Get()
  async getSessions(@Req() req: RequestWithUser) {
    return await this.queryBus.execute<
      GetSessionCommand,
      Promise<SessionsViewModels[]>
    >(new GetSessionCommand(req.user.userId));
  }

  @ApiResponse({
    status: 204,
    description: 'All sessions except the current one have been deleted.',
  })
  @ApiResponseError(ErrorSwagger)
  @UseGuards(RefreshAuthGuard)
  @HttpCode(204)
  @Delete()
  async deleteAllSessionsExcludeCurrent(@Req() req: RequestWithUser) {
    const result = await this.commandBus.execute<
      DeleteSessionsExcludeCurrentCommand,
      Promise<boolean>
    >(
      new DeleteSessionsExcludeCurrentCommand(
        req.user.userId,
        req.user.deviceId,
      ),
    );
    if (!result) throw new InternalServerErrorException();
    return;
  }

  @ApiResponse({
    status: 204,
    description: 'Session by deviceId has been deleted.',
  })
  @ApiResponseError(ErrorSwagger)
  @UseGuards(RefreshAuthGuard)
  @UseGuards(RefreshAuthGuard)
  @UseInterceptors(CheckOwnerDeviceInterceptor)
  @HttpCode(204)
  @Delete(':id')
  async deleteSessionByDeviceId(
    @Param('id') deviceId: string,
    @Req() req: RequestWithUser,
  ) {
    const result = await this.commandBus.execute<
      DeleteSessionCommand,
      Promise<boolean>
    >(new DeleteSessionCommand(req.user.userId, deviceId));
    if (!result) throw new InternalServerErrorException();
    return;
  }
}
