import { Module } from '@nestjs/common';
import { AuthModule } from '../user/auth/auth.module';
import { RootQueryResolver } from './internal/Schemas/RootQueryResolver';
import { PublicQueriesResolver } from './internal/Schemas/Queries/PublicQueries';
import { PublicMutationResolver } from './internal/Schemas/Mutation/PublicMutations';
import { RootMutationResolver } from './internal/Schemas/RootMutationResolver';
import { registerEnumType } from '@nestjs/graphql';
import { OAuthProvider } from '../user/auth/api/Provider';
import { AuthQueriesResolver } from './internal/Schemas/Queries/AuthQueries';
import { AuthOrchestrator } from './internal/application/AuthOrchestratorService';
import { UserModule } from '../user/user.module';
import { AuthMutationsResolver } from './internal/Schemas/Mutation/AuthMutations';

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
