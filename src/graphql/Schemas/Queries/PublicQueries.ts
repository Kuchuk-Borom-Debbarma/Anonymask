import {
  Args,
  Field,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import AuthService from '../../../user/auth/api/service/AuthService';

@ObjectType()
export class PublicQueries {
  @Field(() => String, { nullable: false })
  getOAuthLoginUrl: string;
}

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
