import { Mutation, Resolver } from '@nestjs/graphql';
import { PublicMutations } from './Mutation/PublicMutations';

@Resolver()
export class RootMutationResolver {
  @Mutation(() => PublicMutations, { name: 'public', nullable: false })
  publicEndpoint(): PublicMutations {
    return new PublicMutations();
  }
}
