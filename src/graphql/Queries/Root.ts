import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';

@ObjectType()
class PublicEndpoint {
  @Field({ name: 'googleOAuthLogin' })
  getGoogleOAuthLoginUrl(): string {
    return 'DUMMY URL';
  }
}

@Resolver('Query')
export default class RootQueryResolver {
  @Query(() => PublicEndpoint)
  publicEndpoint(): PublicEndpoint {
    return new PublicEndpoint();
  }
}
