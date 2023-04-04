import { TokenInfo } from '../../../types/domain/token-info.schema';
import { FindFilterTokenInfoType } from '../find-filter-token-info.type';
import { DeleteFilterTokenInfoType } from '../delete-filter-token-info.type';

export const TOKEN_INFO_REPO = 'TOKEN INFO REPO';
export interface ITokensInfoRepo {
  create(session: TokenInfo): Promise<number>;
  update(session: TokenInfo): Promise<boolean>;
  findOneByFilter(filter: FindFilterTokenInfoType): Promise<TokenInfo | null>;
  deleteOneByFilter(filter: DeleteFilterTokenInfoType): Promise<boolean>;
  deleteAllExceptCurrentDeviceId(
    userId: number,
    deviceId: string,
  ): Promise<boolean>;
}
