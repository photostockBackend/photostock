import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { UserModel } from '../models/users.model';
import { UpdateUserArgs } from '../dto/users.args';
  
@Resolver(() => [UserModel])
export class SuperAdminResolver {
    constructor(
    ) {}
  
    @Query(() => [UserModel])
    async getUsers(@Args('arg') id: number): Promise<UserModel[]> {
        console.log('query-args', id)
        return []
    }
  
    @Mutation(() => Boolean)
    async deleteUser(@Args() args: UpdateUserArgs): Promise<boolean> {
        console.log('delete-args', args)
        return true
    }
}