import { Query, Resolver } from '@nestjs/graphql';
import { PublicQueries } from './Queries/PublicQueries';

@Resolver()
export class RootQueryResolver {
  @Query(() => PublicQueries, { name: 'public', nullable: true })
  publicEndpoint(): PublicQueries {
    return new PublicQueries();
  }
}
