import {
  TokenInfoCreateDtoType,
  TokenInfoUpdateDto,
} from '../../auth/types/token-info.types';
import { User } from './user.schema';

export class TokenInfo {
  constructor(tokenInfoDto: TokenInfoCreateDtoType) {
    this.issuedAt = tokenInfoDto.issuedAt;
    this.expirationAt = tokenInfoDto.expirationAt;
    this.deviceId = tokenInfoDto.deviceId;
    this.deviceIp = tokenInfoDto.deviceIp;
    this.deviceName = tokenInfoDto.deviceName;
    this.userId = tokenInfoDto.userId;
  }
  id: number;
  issuedAt: number;
  expirationAt: number;
  deviceId: string;
  deviceIp: string;
  deviceName: string;
  userId: number;
  user: User;

  updateProperties(tokenInfoUpdateDto: TokenInfoUpdateDto) {
    this.issuedAt = tokenInfoUpdateDto.issuedAt;
    this.expirationAt = tokenInfoUpdateDto.expirationAt;
    this.deviceIp = tokenInfoUpdateDto.deviceIp;
  }
}
