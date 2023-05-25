import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@ArgsType()
export class PaginatorArgs {
  @Field()
  pageSize?: number;
  @Field()
  pageNumber?: number;
  @Field()
  searchUsernameTerm?: string;
  @Field()
  sort?: string;
}
