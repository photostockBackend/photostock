import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login.command';
import { AuthService } from '../services/auth.service';
import { JWT } from '../../../../helpers/jwt';
import { v4 as uuidv4 } from 'uuid';
import { TokensInfoRepo } from '../../types/interfaces/tokens-info-repo.interface';
import { TokenInfo } from '../../../types/domain/token-info.schema';

class TokensType {}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private jwtService: JWT,
    private refreshTokenMetaRepository: TokensInfoRepo,
  ) {}

  async execute(command: LoginCommand): Promise<TokensType> {
    const { userId, deviceName, ip } = command;
    const accessToken = this.jwtService.sign(
      { userId: userId },
      { expiresIn: '15m' },
    );
    const deviceId = uuidv4();
    const refreshToken = this.jwtService.sign(
      { userId: userId, deviceId: deviceId },
      { expiresIn: '1h' },
    );
    const getPayload = await this.authService.getPayload(refreshToken);
    const session = new TokenInfo({
      issuedAt: getPayload.iat,
      expirationAt: getPayload.exp,
      deviceId: getPayload.deviceId,
      deviceIp: ip,
      deviceName: deviceName,
      userId: getPayload.userId,
    });
    await this.refreshTokenMetaRepository.create(session);
    return { accessToken, refreshToken };
  }
}
