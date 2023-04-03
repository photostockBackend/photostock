import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNewPairTokensCommand } from './commands/create-new-pair-tokens.command';
import { TokensType } from '../../types/tokens.type';
import { AuthService } from '../services/auth.service';
import { JWT } from '../../../../helpers/jwt';
import { TokensInfoRepo } from '../../types/interfaces/tokens-info-repo.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthCommandRepo } from '../../infrastructure/command.repo';

@CommandHandler(CreateNewPairTokensCommand)
export class CreateNewPairTokensUseCase
  implements ICommandHandler<CreateNewPairTokensCommand>
{
  /*constructor(
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
  }*/
  constructor(
    private devicesRepo: AuthCommandRepo,
    private readonly jwtService: JWT,
    private configService: ConfigService,
  ) {}

    async execute(command: CreateNewPairTokensCommand){
      /*try{
        const session = await this.devicesRepo.findOneDeviceByRefreshTokenData(command.deviceId, command.issuedAt)
        if(session) {
          const issuedAt = new Date().getTime()
          const expiresAt = new Date().getTime() + Number(this.configService.get('JWT_PERIOD')) * 1000
          const payloadAccess = {userId: session.userId, deviceId: session.deviceId, issuedAt: issuedAt}
          const payloadRefresh = {userId: session.userId, deviceId: session.deviceId, issuedAt: issuedAt}
          const accessToken = this.jwtService.sign(payloadAccess, {expiresIn: `${Number(this.configService.get('JWT_PERIOD')) / 2}s`})
          const refreshToken = this.jwtService.sign(payloadRefresh, {expiresIn: `${Number(this.configService.get('JWT_PERIOD'))}s`})
          await this.devicesRepo.refreshToken(session.deviceId, issuedAt, expiresAt)
          return {
            accessToken,
            refreshToken
          }
        } else {
          throw new HttpException('Auth not found', HttpStatus.UNAUTHORIZED)
        }
      }
      catch(e){
        throw new HttpException('Auth not found', HttpStatus.UNAUTHORIZED)
      }*/
    }
}
