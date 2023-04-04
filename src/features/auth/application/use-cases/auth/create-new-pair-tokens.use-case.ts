import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewPairTokensCommand } from './commands/create-new-pair-tokens.command';
import { JWT } from '../../../../../helpers/jwt';
import { AuthService } from '../../services/auth.service';
import {
  ITokensInfoRepo,
  TOKEN_INFO_REPO,
} from '../../../types/interfaces/i-tokens-info.repo';
import { TokensType } from '../../../types/tokens.type';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateNewPairTokensCommand)
export class CreateNewPairTokensUseCase
  implements ICommandHandler<CreateNewPairTokensCommand>
{
  constructor(
    private authService: AuthService,
    private jwtService: JWT,
    @Inject(TOKEN_INFO_REPO) private tokenInfoRepository: ITokensInfoRepo,
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
