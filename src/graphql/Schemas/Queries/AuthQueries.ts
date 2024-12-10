import { Field, ObjectType, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../../infrastructure/UserAuthGuard';

@ObjectType()
export class AuthQueries {
  @Field(() => String, { nullable: false })
  test: string;
}

@Resolver(() => AuthQueries)
export class AuthQueriesQueriesResolver {
  @UseGuards(UserAuthGuard)
  @ResolveField()
  test(): string {
    return 'Auth endpoint';
  }
}
