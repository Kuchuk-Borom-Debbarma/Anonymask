import {
  Context,
  Field,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import UserDTO from '../../../user/api/dto/UserDTO';
import { FastifyRequest } from 'fastify';
import { IResponseModel, ResponseModel } from '../Types/Root.types';

@ObjectType()
export class UserInfoResponse {
  @Field()
  id: string;
  @Field()
  name: string;
}

const userInfoResponse = ResponseModel(UserInfoResponse);

@ObjectType()
export class AuthQueries {
  @Field(() => userInfoResponse, { nullable: false })
  userInfo: IResponseModel<UserInfoResponse>;
}

@Resolver(() => AuthQueries)
export class AuthQueriesResolver {
  @ResolveField()
  userInfo(@Context() context: any): IResponseModel<UserInfoResponse> {
    // Correctly access the request from GraphQL context
    const request: FastifyRequest = context.req;

    const user: UserDTO = request.user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    return {
      success: true,
      data: {
        name: user.username,
        id: user.userID,
      },
    };
  }
}
