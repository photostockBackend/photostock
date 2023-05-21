import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
class UpdateUserDto {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  age?: number;
}

@ArgsType()
export class UpdateUserArgs {
  @Field()
  userId: string;
  @Field(() => UpdateUserDto)
  data: UpdateUserDto;
}
