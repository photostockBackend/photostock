import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TokenInfoQueryRepo } from '../../../../infrastructure/query.repositories/token-info.query.repo';
import { SessionsViewModels } from '../../../../types/sessions-view.models';

export class GetSessionCommand {
  constructor(public readonly userId: number) {}
}
@QueryHandler(GetSessionCommand)
export class GetSessionsUseCase implements IQueryHandler<GetSessionCommand> {
  constructor(private queryRepo: TokenInfoQueryRepo) {}
  async execute(query: GetSessionCommand): Promise<SessionsViewModels[]> {
    const { userId } = query;
    return await this.queryRepo.findSessionsByUserId(userId);
  }
}
