import { TokenInfo } from '../../../types/domain/token-info.schema';

export interface TokensInfoRepo {
  create(session: TokenInfo): number;
  update(session: TokenInfo): boolean;
  findOne(filter: any): TokenInfo;
  deleteOne(filter: any): boolean;
  deleteMany(filter: any): boolean;
}
