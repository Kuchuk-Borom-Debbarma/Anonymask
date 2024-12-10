import { Module } from '@nestjs/common';
import { AuthModule } from '../user/auth/auth.module';
import { RootQueryResolver } from './Schemas/RootQueryResolver';
import { PublicQueriesResolver } from './Schemas/Queries/PublicQueries';
import { PublicMutationResolver } from './Schemas/Mutation/PublicMutations';
import { RootMutationResolver } from './Schemas/RootMutationResolver';
import { registerEnumType } from '@nestjs/graphql';
import { OAuthProvider } from '../user/auth/api/Provider';
import { AuthQueriesQueriesResolver } from './Schemas/Queries/AuthQueries';

@Module({
  providers: [
    RootQueryResolver,
    RootMutationResolver,
    PublicQueriesResolver,
    PublicMutationResolver,
    AuthQueriesQueriesResolver,
  ],
  imports: [AuthModule],
})
export class GraphqlModule {
  constructor() {
    registerEnumType(OAuthProvider, {
      name: 'OAuthProvider', // This is the GraphQL name
      description: 'Supported OAuth providers', // Optional description
    });
  }
}
