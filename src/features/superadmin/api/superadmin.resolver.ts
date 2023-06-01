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
import { ChangeUserStatusArgs, PaginatorArgs } from '../dto/users.args';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindUsersByAdminQuery } from '../application/find-users-by-admin.query';
import { DeleteUserByAdminCommand } from '../application/delete-user-by-admin.command';
import { ChangeUserStatusByAdminCommand } from '../application/change-user-status-by-admin.command';

@Resolver(() => [UserModel])
export class SuperAdminResolver {
    constructor(
        private commandBus: CommandBus, 
        private queryBus: QueryBus,
    ) {}
  
    @Query(() => [UserModel])
    async getUsers(@Args() args: PaginatorArgs): Promise<PaginatorModel<UserModel[]>> {
        return await this.queryBus.execute<FindUsersByAdminQuery, Promise<PaginatorModel<UserModel[]>>>(new FindUsersByAdminQuery(args.data));
    }
  
    @Mutation(() => Boolean)
    async deleteUser(@Args('id') id: number): Promise<boolean> {
        const result = await this.commandBus.execute<DeleteUserByAdminCommand, Promise<boolean>>(new DeleteUserByAdminCommand(id));
        return true
    }

    @Mutation(() => Boolean)
    async changeUserStatus(@Args() args: ChangeUserStatusArgs): Promise<boolean> {
        const result = await this.commandBus.execute<ChangeUserStatusByAdminCommand, Promise<boolean>>(new ChangeUserStatusByAdminCommand(args.data));
        return true
    }

}