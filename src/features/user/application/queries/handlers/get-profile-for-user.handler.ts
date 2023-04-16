import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserProfileQueryRepo } from '../../../infrastructure/query.repositories/user-profile.query.repo';
import { ProfileUserViewModel } from '../../../types/profile/user-profile-view.models';

export class GetProfileUserCommand {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetProfileUserCommand)
export class GetProfileForUserHandler
  implements IQueryHandler<GetProfileUserCommand>
{
  constructor(private queryRepo: UserProfileQueryRepo) {}
  async execute(query: GetProfileUserCommand): Promise<ProfileUserViewModel> {
    const { userId } = query;
    return await this.queryRepo.findProfileUserByUserId(userId);
  }
}
