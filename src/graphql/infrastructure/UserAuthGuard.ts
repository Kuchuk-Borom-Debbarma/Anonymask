import { ArgumentsHost, CanActivate, Injectable } from '@nestjs/common';
import JwtService from '../../user/auth/api/service/JwtService';
import { FastifyRequest } from 'fastify';
import UserService from '../../user/api/service/UserService';

/*
Very important https://docs.nestjs.com/fundamentals/execution-context
 */
@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ArgumentsHost): Promise<boolean> {
    const request: FastifyRequest = context.getArgByIndex(2).req;
    console.log(`Context Req : ${String(request)}`);

    if (!request) {
      console.error('Request object is missing in the GraphQL context');
      return false;
    }

    const authHeader: string | undefined = request.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Authorization header missing or invalid');
      return false;
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    let decoded: any;
    try {
      decoded = this.jwtService.verifySignature(token);
      console.log(`Decoded token: ${JSON.stringify(decoded)}`);
    } catch (err) {
      console.warn('JWT verification failed:', err.message);
      return false;
    }

    const user = await this.userService.getBaseUserById(decoded.userId);
    if (!user) {
      console.warn(`User with ID ${decoded.userId} not found in the database`);
      return false;
    }
    console.log('User found in database');
    // Attach the authenticated user to the request for later use
    request.user = user;
    return true;
  }
}
