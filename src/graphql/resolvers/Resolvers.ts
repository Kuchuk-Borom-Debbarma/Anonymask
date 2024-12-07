import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TestResolver {
  @Query(() => String)
  test(): string {
    return 'ANOTHER MODIFICATION This is a modified test';
  }
}
