import {
  Args,
  Field,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { OAuthProvider } from '../../../user/auth/api/Provider';
import { IResponseModel, StringResponse } from '../Types/Root.types';
import AuthService from '../../../user/auth/api/service/AuthService';

@ObjectType()
export class PublicQueries {
  @Field(() => StringResponse)
  getOAuthLoginUrl: IResponseModel<String>;
}

@Resolver(() => PublicQueries)
export class PublicQueriesResolver {
  constructor(private authService: AuthService) {}

  @ResolveField(() => StringResponse)
  getOAuthLoginUrl(
    @Args('source', { type: () => OAuthProvider }) source: OAuthProvider,
  ): IResponseModel<String> {
    switch (source) {
      case OAuthProvider.GOOGLE:
        return {
          success: true,
          data: this.authService.generateOAuthLoginUrl(),
        };
      default:
        return {
          success: false,
          message: 'Invalid OAuth Provider',
        };
    }
  }
}
