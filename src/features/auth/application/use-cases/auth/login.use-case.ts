import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginCommand } from './commands/login.command';
import { JWT } from '../../../../../helpers/jwt';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../services/auth.service';
import { ITokensInfoRepo } from '../../../types/interfaces/i-tokens-info.repo';
import { TokenInfoDomain } from '../../../../types/domain/token-info.domain';

class TokensType {}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private jwtService: JWT,
    private configService: ConfigService,
    @Inject('TOKEN INFO REPO')
    private tokensInfoRepository: ITokensInfoRepo,
  ) {}

  async execute(command: LoginCommand): Promise<TokensType> {
    const { userId, deviceName, ip } = command;
    const accessToken = this.jwtService.sign(
      { userId: userId },
      { expiresIn: `${Number(this.configService.get('ACCESS_PERIOD'))}s` },
    );
    const deviceId = uuidv4();
    const refreshToken = this.jwtService.sign(
      { userId: userId, deviceId: deviceId },
      { expiresIn: `${Number(this.configService.get('REFRESH_PERIOD'))}s` },
    );
    const getPayload = await this.authService.getPayload(refreshToken);
    const session = new TokenInfoDomain({
      issuedAt: getPayload.iat,
      expirationAt: getPayload.exp,
      deviceId: getPayload.deviceId,
      deviceIp: ip,
      deviceName: deviceName,
      userId: getPayload.userId,
    });
    await this.tokensInfoRepository.create(session);

    return { accessToken, refreshToken };
  }
}
