import {
  Args,
  Field,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import AuthService from '../../../user/auth/api/service/AuthService';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/user-auth-guard/user-auth-guard.guard';

@ObjectType()
export class PublicQueries {
  @Field(() => String, { nullable: false })
  getOAuthLoginUrl: string;
}

@UseGuards(new UserAuthGuard())
@Resolver(() => PublicQueries)
export class PublicQueriesResolver {
  constructor(private authService: AuthService) {}

  @ResolveField()
  getOAuthLoginUrl(
    @Args('source', { type: () => String }) source: string, // Define the 'source' argument
  ): string {
    return this.authService.generateOAuthLoginUrl(); // Pass the source to the service
  }
}
