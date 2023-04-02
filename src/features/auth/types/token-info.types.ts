export type TokenInfoCreateDtoType = {
  issuedAt: number;
  expirationAt: number;
  deviceId: string;
  deviceIp: string;
  deviceName: string;
  userId: number;
};
export class TokenInfoUpdateDto {
  issuedAt: number;
  expirationAt: number;
  deviceIp: string;
}
