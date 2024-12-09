import {
  Args,
  Field,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import AuthService from '../../../user/auth/api/service/AuthService';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../../infrastructure/UserAuthGuard';
import { OAuthProvider } from '../../../user/auth/api/Provider';

@ObjectType()
export class PublicQueries {
  @Field(() => String, { nullable: false })
  getOAuthLoginUrl: string;

  @Field(() => String, { nullable: false })
  test: string;
}

@Resolver(() => PublicQueries)
export class PublicQueriesResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(UserAuthGuard)
  @ResolveField()
  getOAuthLoginUrl(
    @Args('source', { type: () => OAuthProvider }) source: OAuthProvider,
  ): string {
    return this.authService.generateOAuthLoginUrl();
  }

  @UseGuards(UserAuthGuard)
  @ResolveField()
  test(): string {
    return 'Auth endpoint';
  }
}
