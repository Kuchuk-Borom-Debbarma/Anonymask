import { Mutation, Resolver } from '@nestjs/graphql';
import { PublicMutations } from './Mutation/PublicMutations';
import { AuthMutations } from './Mutation/AuthMutations';
import { UseGuards } from "@nestjs/common";
import { UserAuthGuard } from "../infrastructure/UserAuthGuard";

@Resolver()
export class RootMutationResolver {
  @Mutation(() => PublicMutations, { name: 'public', nullable: false })
  publicEndpoint(): PublicMutations {
    return new PublicMutations();
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => AuthMutations, { name: 'auth', nullable: false })
  authEndpoint(): AuthMutations {
    return new AuthMutations();
  }
}
