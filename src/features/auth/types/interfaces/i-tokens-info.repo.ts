import { TokenInfoDomain } from '../../../types/domain/token-info.domain';
import { FindFilterTokenInfoType } from '../find-filter-token-info.type';
import { DeleteFilterTokenInfoType } from '../delete-filter-token-info.type';

export const TOKEN_INFO_REPO = 'TOKEN INFO REPO';
export interface ITokensInfoRepo {
  create(session: TokenInfoDomain): Promise<number>;
  update(session: TokenInfoDomain): Promise<boolean>;
  findOneByFilter(
    filter: FindFilterTokenInfoType,
  ): Promise<TokenInfoDomain | null>;
  deleteOneByFilter(filter: DeleteFilterTokenInfoType): Promise<boolean>;
  deleteAllExceptCurrentDeviceId(
    userId: number,
    deviceId: string,
  ): Promise<boolean>;
}
