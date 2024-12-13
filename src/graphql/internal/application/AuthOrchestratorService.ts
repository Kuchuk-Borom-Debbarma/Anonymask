import { Injectable, Logger } from '@nestjs/common';
import JwtService from '../../../user/auth/api/service/JwtService';
import AuthService from '../../../user/auth/api/service/AuthService';
import UserService from '../../../user/api/service/UserService';
import { OAuthProvider } from '../../../user/auth/api/Provider';
import { UserInfoDTO } from '../../../user/auth/api/dto/UserInfoDTO';
import UserDTO from 'src/user/api/dto/UserDTO';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthOrchestrator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private log = new Logger(AuthOrchestrator.name);

  public async generateAccessToken(code: string, oauthProvide: OAuthProvider) {
    const userInfo: UserInfoDTO =
      await this.authService.getUserInfoFromOAuthToken(code);
    try {
      await this.userService.createBaseUser(userInfo.id, userInfo.name);
    } catch (error) {}
    return this.jwtService.generateJwt(null, userInfo.id);
  }

  public getCurrentUser(context: any): UserDTO | null {
    this.log.debug('Getting current user');
    const req: FastifyRequest = context.req;
    if (!req) {
      this.log.warn('Failed to get request from context.');
      return;
    }
    const user = req.user;
    if (!user) {
      this.log.warn('User is undefined in req');
      return;
    }
    this.log.debug(`Got current user ${JSON.stringify(user)}`);
    return user;
  }

  public async updateUserInfo(userId: string, info: { name: string }) {
    return await this.userService.updateUser(userId, { username: info.name });
  }
}
