import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { USERS_REPO } from '../../auth/types/interfaces/i-users.repo';
import { AuthQueryRepo } from '../../auth/infrastructure/query.repositories/auth.query.repo';
import { PaginatorArgs } from '../dto/users.args';

export class FindUsersByAdminQuery {
  constructor(
    public query: PaginatorArgs,
  ) {}
}

@CommandHandler(FindUsersByAdminQuery)
export class FindUsersByAdminUseCase
  implements ICommandHandler<FindUsersByAdminQuery>
{
  constructor(
    @Inject(USERS_REPO) private usersRepository: AuthQueryRepo,
  ) {}
  async execute(query: FindUsersByAdminQuery): Promise<boolean> {
    const queryParams = {
      pageNumber: query.query.pageNumber ?? 1,
      pageSize: query.query.pageSize ?? 10,
      searchUsernameTerm: query.query.searchUsernameTerm ?? '',
      sort: query.query.sort ?? 'desc'
    }
    
    return this.usersRepository.findAllUsersWithPagination(queryParams)
  }
}
