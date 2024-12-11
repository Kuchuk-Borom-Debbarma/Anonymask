import {
  Context,
  Field,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import UserDTO from '../../../user/api/dto/UserDTO';
import { FastifyRequest } from 'fastify';

@ObjectType()
export class UserInfoResponse {
  @Field()
  id: string;
  @Field()
  name: string;
}

@ObjectType()
export class AuthQueries {
  @Field(() => UserInfoResponse, { nullable: false })
  userInfo: UserInfoResponse;
}

@Resolver(() => AuthQueries)
export class AuthQueriesResolver {
  @ResolveField()
  userInfo(@Context() context: any): UserInfoResponse {
    // Correctly access the request from GraphQL context
    const request: FastifyRequest = context.req;

    const user: UserDTO = request.user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    return {
      name: user.username,
      id: user.userID,
    };
  }
}
