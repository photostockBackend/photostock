import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { StatusUserType } from 'src/core/domain/userStatus.domain';

@InputType()
export class Paginator {
  @Field({nullable: true})
  pageSize?: number;
  @Field({nullable: true})
  pageNumber?: number;
  @Field({nullable: true})
  searchUsernameTerm?: string;
  @Field({nullable: true})
  sort?: string;
}

@ArgsType()
export class PaginatorArgs {
  @Field(() => Paginator)
  data: Paginator
}

@InputType()
export class ChangeUserStatus implements StatusUserType {
  @Field()
  userId: number;
  @Field()
  status: 'active' | 'ban';
  @Field()
  statusReason: string;
}

@ArgsType()
export class ChangeUserStatusArgs {
  @Field(() => ChangeUserStatus)
  data: ChangeUserStatus
}