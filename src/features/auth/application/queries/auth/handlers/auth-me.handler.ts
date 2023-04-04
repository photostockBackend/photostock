import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthMeCommand } from '../commands/auth-me.command';
import { AuthQueryRepo } from '../../../../infrastructure/query.repositories/query.repo';
import { AuthMeViewModel } from '../../../../types/auth-view.models';

@QueryHandler(AuthMeCommand)
export class AuthMeHandler implements IQueryHandler<AuthMeCommand> {
  constructor(private queryRepo: AuthQueryRepo) {}
  async execute(query: AuthMeCommand): Promise<AuthMeViewModel> {
    const { userId } = query;
    return await this.queryRepo.getAuthMe(userId);
  }
}
