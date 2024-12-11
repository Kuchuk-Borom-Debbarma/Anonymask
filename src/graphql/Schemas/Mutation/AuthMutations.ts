import {
  Args,
  ArgsType,
  Context,
  Field,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { AuthOrchestrator } from '../../application/AuthOrchestratorService';
import { IResponseModel, StringResponse } from '../Types/Root.types';

@ArgsType()
export class updateUserInput {
  @Field(() => String, { nullable: true })
  username?: string;
}

@ObjectType()
export class AuthMutations {
  @Field(() => StringResponse)
  updateUser: IResponseModel<String>;
}

@Resolver(() => AuthMutations)
export class AuthMutationsResolver {
  constructor(private orchestrator: AuthOrchestrator) {}

  private log = new Logger(AuthMutationsResolver.name);

  @ResolveField()
  async updateUser(
    @Context() context: any,
    @Args() info: updateUserInput,
  ): Promise<IResponseModel<String>> {
    this.log.debug(`Updating user info ${JSON.stringify(info)}`);
    const user = this.orchestrator.getCurrentUser(context);
    await this.orchestrator.updateUserInfo(user.userID, {
      name: info.username,
    });
    return {
      success: true,
      message: '',
    };
  }
}
