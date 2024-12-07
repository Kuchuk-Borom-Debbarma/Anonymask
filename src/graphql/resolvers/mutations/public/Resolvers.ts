import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ResponseModel } from 'src/common/ResponseModel';
import { OAuthProvider } from 'src/user/auth/api/Provider';
import AuthService from 'src/user/auth/api/service/AuthService';
import JwtService from 'src/user/auth/api/service/JwtService';

//TODO:Remove the dummy claims
//TODO:make a userInfoDTO for auth
//TODO:Make Orchestrator Service 

@Resolver()
export class PublicMutationResolver {
  constructor(private authService: AuthService,private jwtService:JwtService) {}

  @Mutation(() => String)
  async exchangeOAuthToken(
    @Args('code')
    code: string,
  ): Promise<ResponseModel<string>> {
    const userInfo = await this.authService.getUserInfoFromOAuthToken(code)
    const claims = new Map<string, string>([
      ['role', 'admin'],
    ]);
    const token = this.jwtService.generateJwt(claims,userInfo.email);
    return{
      msg:"yes",
      data:token
    }
  }
}
