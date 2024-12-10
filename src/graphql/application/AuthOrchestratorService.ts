import { Injectable } from "@nestjs/common";
import JwtService from "../../user/auth/api/service/JwtService";
import AuthService from "../../user/auth/api/service/AuthService";
import UserService from "../../user/api/service/UserService";
import { OAuthProvider } from "../../user/auth/api/Provider";
import { UserInfoDTO } from "../../user/auth/api/dto/UserInfoDTO";

@Injectable()
export class AuthOrchestrator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  public async generateAccessToken(
    code: string,
    oauthProvide: OAuthProvider
  ) {
    const userInfo: UserInfoDTO = await this.authService.getUserInfoFromOAuthToken(code);
    try {
      await this.userService.createBaseUser(userInfo.id, userInfo.name);
    }
    catch (error) { }
    const token = this.jwtService.generateJwt(null, userInfo.id);
    return token;
  }

}