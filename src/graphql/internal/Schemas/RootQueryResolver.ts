import { Query, Resolver } from '@nestjs/graphql';
import { PublicQueries } from './Queries/PublicQueries';
import { AuthQueries } from './Queries/AuthQueries';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../infrastructure/UserAuthGuard';

@Resolver()
export class RootQueryResolver {
  @Query(() => PublicQueries, { name: 'public', nullable: true })
  publicEndpoint(): PublicQueries {
    return new PublicQueries();
  }

  @UseGuards(UserAuthGuard)
  @Query(() => AuthQueries, { name: 'auth', nullable: true })
  authEndpoint(): AuthQueries {
    return new AuthQueries();
  }
}
