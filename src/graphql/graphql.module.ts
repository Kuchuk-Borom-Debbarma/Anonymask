import { Module } from '@nestjs/common';
import { AuthModule } from '../user/auth/auth.module';
import { RootQueryResolver } from './Schemas/RootQueryResolver';
import { PublicQueriesResolver } from './Schemas/Queries/PublicQueries';
import { PublicMutationResolver } from './Schemas/Mutation/PublicMutations';
import { RootMutationResolver } from './Schemas/RootMutationResolver';
import { registerEnumType } from '@nestjs/graphql';
import { OAuthProvider } from '../user/auth/api/Provider';
import { AuthQueriesResolver } from './Schemas/Queries/AuthQueries';
import { AuthOrchestrator } from './application/AuthOrchestratorService';
import { UserModule } from '../user/user.module';
import { AuthMutationsResolver } from './Schemas/Mutation/AuthMutations';

@Module({
  providers: [
    RootQueryResolver,
    RootMutationResolver,
    PublicQueriesResolver,
    PublicMutationResolver,
    AuthQueriesResolver,
    AuthOrchestrator,
    AuthMutationsResolver,
  ],
  imports: [AuthModule, UserModule],
})
export class GraphqlModule {
  constructor() {
    registerEnumType(OAuthProvider, {
      name: 'OAuthProvider',
      description: 'Supported OAuth providers',
    });
  }
}
