import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT } from '../../../../../helpers/jwt';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../services/auth.service';
import {
  ITokensInfoRepo,
  TOKEN_INFO_REPO,
} from '../../../types/interfaces/i-tokens-info.repo';
import { TokenInfoDomain } from '../../../../../core/domain/token-info.domain';
import { TokensType } from '../../../types/tokens.type';

export class LoginCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceName: string,
    public readonly ip: string,
  ) {}
}
@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private jwtService: JWT,
    private configService: ConfigService,
    @Inject(TOKEN_INFO_REPO)
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
