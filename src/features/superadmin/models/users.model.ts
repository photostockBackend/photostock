import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'user profile' })
export class UserModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => Int, { nullable: true })
  age: number | null;

  @Field(() => String, { nullable: true })
  avatarId: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;
}