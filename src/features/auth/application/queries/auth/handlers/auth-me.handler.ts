import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthQueryRepo } from '../../../../infrastructure/query.repositories/auth.query.repo';
import { AuthMeViewModel } from '../../../../types/auth-view.models';

export class AuthMeCommand {
  constructor(public readonly userId: number) {}
}

@QueryHandler(AuthMeCommand)
export class AuthMeHandler implements IQueryHandler<AuthMeCommand> {
  constructor(private queryRepo: AuthQueryRepo) {}
  async execute(query: AuthMeCommand): Promise<AuthMeViewModel> {
    const { userId } = query;
    return await this.queryRepo.getAuthMe(userId);
  }
}
