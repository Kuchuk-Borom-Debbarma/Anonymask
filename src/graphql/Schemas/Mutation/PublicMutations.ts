import {
  Args,
  Field,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { OAuthProvider } from '../../../user/auth/api/Provider';

@ObjectType()
export class PublicMutations {
  @Field(() => String, { nullable: false })
  generateAccessToken: string;
}

@Resolver(() => PublicMutations)
export class PublicMutationResolver {
  @ResolveField()
  generateAccessToken(
    @Args('code', { type: () => String, nullable: false }) code: string,
    @Args('oAuthProvider', { type: () => OAuthProvider, nullable: false })
    provider: OAuthProvider,
  ) {
    return `Dummy token ${code} ___ ${provider}`
  }
}
