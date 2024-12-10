import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RootQuery {
  //public query
  @Query(() => PublicQuery, { name: 'public' })
  publicEndpoint(): PublicQuery {}

  @Query(() => PrivateQuery, { name: 'private' })
  privateEndpoint(): PrivateQuery {}

  @Query(() => AuthQuery, { name: 'auth' })
  authEndpoint(): AuthQuery {}
}
