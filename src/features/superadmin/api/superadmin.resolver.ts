import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { PaginatorModel, UserModel } from '../models/users.model';
import { PaginatorArgs } from '../dto/users.args';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindUsersByAdminQuery } from '../application/find-users-by-admin.query';
import { DeleteUserByAdminCommand } from '../application/delete-user-by-admin.command';

@Resolver(() => [UserModel])
export class SuperAdminResolver {
    constructor(
        private commandBus: CommandBus, 
        private queryBus: QueryBus,
    ) {}
  
    @Query(() => [UserModel])
    async getUsers(@Args() query: PaginatorArgs): Promise<PaginatorModel> {
        return await this.commandBus.execute<FindUsersByAdminQuery, Promise<PaginatorModel>>(new FindUsersByAdminQuery(query));
    }
  
    @Mutation(() => Boolean)
    async deleteUser(@Args('id') id: number): Promise<boolean> {
        const result = await this.queryBus.execute<DeleteUserByAdminCommand, Promise<boolean>>(new DeleteUserByAdminCommand(id));
        return true
    }
}