import {
  Args,
  Field,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { OAuthProvider } from '../../../../user/auth/api/Provider';
import { AuthOrchestrator } from '../../application/AuthOrchestratorService';
import { IResponseModel, StringResponse } from '../Types/Root.types';

@ObjectType()
export class PublicMutations {
  @Field(() => StringResponse, { nullable: false })
  generateAccessToken: IResponseModel<string>;
}

@Resolver(() => PublicMutations)
export class PublicMutationResolver {
  constructor(private authOrchestrator: AuthOrchestrator) {}

  @ResolveField()
  async generateAccessToken(
    @Args('code', { type: () => String, nullable: false }) code: string,
    @Args('oAuthProvider', { type: () => OAuthProvider, nullable: false })
    provider: OAuthProvider,
  ): Promise<IResponseModel<string>> {
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBbm9ueU1hc2siLCJpYXQiOjE3MzM4NzEyNTEsInN1YiI6Imt1Y2h1a2Jvcm9tZEBnbWFpbC5jb20iLCJleHAiOjE3MzQyMzEyNTF9.apyAWNgInz4Ne1HDOVgoSHw_Ro35CUwQirNPGdoScdE
    return {
      success: true,
      data: await this.authOrchestrator.generateAccessToken(code, provider),
    };
  }
}
