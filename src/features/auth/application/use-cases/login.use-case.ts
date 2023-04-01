import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login.command';
import { AuthService } from '../services/auth.service';
import { JWT } from '../../../../helpers/jwt';

class TokensType {}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private jwtService: JWT,
    private refreshTokenMetaRepository: RefreshTokenMetasRepository,
  ) {}

  async execute(command: LoginCommand): Promise<TokensType> {
    const { userId, deviceName, ip } = command;
    const accessToken = this.jwtService.sign(userId, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(userId, { expiresIn: '1h' });
    const getPayload = await this.authService.getPayload(refreshToken);
    await this.refreshTokenMetaRepository.create({
      issuedAt: getPayload.iat,
      expirationAt: getPayload.exp,
      deviceId: getPayload.deviceId,
      deviceIp: ip,
      deviceName: deviceName,
      userId: getPayload.userId,
    });
    return { accessToken, refreshToken };
  }
}
