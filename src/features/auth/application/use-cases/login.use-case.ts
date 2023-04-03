import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login.command';
import { AuthService } from '../services/auth.service';
import { JWT } from '../../../../helpers/jwt';
import { v4 as uuidv4 } from 'uuid';
import { TokensInfoRepo } from '../../types/interfaces/tokens-info-repo.interface';
import { TokenInfo } from '../../../types/domain/token-info.schema';
import { AuthCommandRepo } from '../../infrastructure/command.repo';
import { ConfigService } from '@nestjs/config';

class TokensType {}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  /*constructor(
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
    //await this.refreshTokenMetaRepository.create(session);

    return { accessToken, refreshToken };
  }*/
  constructor(
    private devicesRepo: AuthCommandRepo,
    private jwtService: JWT,
    private configService: ConfigService,
  ) {}

  async execute(command: LoginCommand){
    const deviceId = uuidv4()
    const session = {
      ip: command.ip,
      title: command.deviceName, 
      deviceId: deviceId,
      issuedAt: new Date().getTime(),
      expiresAt: new Date().getTime() + Number(this.configService.get('JWT_PERIOD')) * 1000,
      userId: command.userId,
    }
    const payloadAccess = {userId: command.userId || '', deviceId: session.deviceId, issuedAt: session.issuedAt}
    const payloadRefresh = {userId: command.userId || '', deviceId: session.deviceId, issuedAt: session.issuedAt}
    const accessToken = this.jwtService.sign(payloadAccess, {expiresIn: `${Number(this.configService.get('JWT_PERIOD')) / 2}s`})
    const refreshToken = this.jwtService.sign(payloadRefresh, {expiresIn: `${Number(this.configService.get('JWT_PERIOD'))}s`})
    await this.devicesRepo.login(session)
    return {
      accessToken,
      refreshToken
    }
  } 
}
