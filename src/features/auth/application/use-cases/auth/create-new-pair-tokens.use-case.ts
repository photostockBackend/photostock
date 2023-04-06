import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateNewPairTokensCommand } from './commands/create-new-pair-tokens.command';
import { JWT } from '../../../../../helpers/jwt';
import { AuthService } from '../../services/auth.service';
import {
  ITokensInfoRepo,
  TOKEN_INFO_REPO,
} from '../../../types/interfaces/i-tokens-info.repo';
import { TokensType } from '../../../types/tokens.type';

@CommandHandler(CreateNewPairTokensCommand)
export class CreateNewPairTokensUseCase
  implements ICommandHandler<CreateNewPairTokensCommand>
{
  constructor(
    private authService: AuthService,
    private jwtService: JWT,
    private configService: ConfigService,
    @Inject(TOKEN_INFO_REPO) private tokenInfoRepository: ITokensInfoRepo,
  ) {}
  async execute(command: CreateNewPairTokensCommand): Promise<TokensType> {
    const { userId, deviceId, ip } = command;
    const accessToken = this.jwtService.sign(
      { userId: userId },
      { expiresIn: `${Number(this.configService.get('ACCESS_PERIOD'))}s` },
    );
    const refreshToken = this.jwtService.sign(
      { userId: userId, deviceId: deviceId },
      { expiresIn: `${Number(this.configService.get('REFRESH_PERIOD'))}s` },
    );
    const getPayload = await this.authService.getPayload(refreshToken);
    const session = await this.tokenInfoRepository.findOneByFilter({
      userId: userId,
      deviceId: deviceId,
    });
    session.updateProperties({
      issuedAt: getPayload.iat,
      expirationAt: getPayload.exp,
      deviceIp: ip,
    });
    await this.tokenInfoRepository.update(session);
    return { accessToken, refreshToken };
  }
}
