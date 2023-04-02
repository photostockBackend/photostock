import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewPairTokensCommand } from './commands/create-new-pair-tokens.command';
import { TokensType } from '../../types/tokens.type';
import { AuthService } from '../services/auth.service';
import { JWT } from '../../../../helpers/jwt';
import { TokensInfoRepo } from '../../types/interfaces/tokens-info-repo.interface';

@CommandHandler(CreateNewPairTokensCommand)
export class CreateNewPairTokensUseCase
  implements ICommandHandler<CreateNewPairTokensCommand>
{
  constructor(
    private authService: AuthService,
    private jwtService: JWT,
    private tokensInfoRepository: TokensInfoRepo,
  ) {}
  async execute(command: CreateNewPairTokensCommand): Promise<TokensType> {
    const { userId, deviceId, ip } = command;
    const accessToken = this.jwtService.sign(
      { userId: userId },
      { expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { userId: userId, deviceId: deviceId },
      { expiresIn: '1h' },
    );
    const getPayload = await this.authService.getPayload(refreshToken);
    const session = await this.tokensInfoRepository.findOne({
      userId,
      deviceId,
    });
    session.updateProperties({
      issuedAt: getPayload.iat,
      expirationAt: getPayload.exp,
      deviceIp: ip,
    });
    await this.tokensInfoRepository.update(session);
    return { accessToken, refreshToken };
  }
}
