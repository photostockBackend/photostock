import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'user profile' })
export class UserModel {
  @Field()
  id: string;

  @Field()
  userName: string;

  @Field()
  email: string;
}

@ObjectType({ description: 'paginator' })
export class PaginatorModel<T> {
  @Field()
  page: number;

  @Field()
  pageSize: number;

  @Field(() => [UserModel])
  users: T
}