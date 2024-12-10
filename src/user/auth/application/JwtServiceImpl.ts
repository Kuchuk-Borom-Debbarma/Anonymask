import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import JwtService from '../api/service/JwtService';
import { ConstantsEnvNames } from '../../../util/Constants';

@Injectable()
export default class JwtServiceImpl implements JwtService {
  constructor(private readonly jwtService: NestJwtService) { }

  // Summary: This function generates a JWT token with optional claims and subject.
  // Default claims (issuer and issued at) are included if no claims are provided.
  // If a subject is supplied, it is added to the token payload.

  generateJwt(claims?: Map<string, string>, subject?: string): string {
    const defaultClaims: Record<string, string> = {
      iss: 'AnonyMask',
      iat: Math.floor(Date.now() / 1000).toString(),
    };

    const claimsObject: Record<string, string> = claims && claims.size > 0
      ? { ...defaultClaims, ...Object.fromEntries(claims) }
      : defaultClaims;

    if (subject && subject.trim() !== '') {
      claimsObject.sub = subject;
    }

    return this.jwtService.sign(claimsObject, {
      secret: ConstantsEnvNames.JWT_SECRET,
      expiresIn: ConstantsEnvNames.JWT_EXPIRES_IN,
      algorithm: 'HS256',
    });
  }

  // Summary: This function verifies the authenticity of a JWT token by checking its signature using the predefined secret and algorithm.
  // If valid, it returns the decoded token; otherwise, it returns an error message with details.

  verifySignature(token: string): any {
    try {
      // @ts-ignore
      const decoded = this.jwtService.verify(token, {
        secret: ConstantsEnvNames.JWT_SECRET,
        algorithms: ['HS256'],
      });
      return decoded;
    } catch (error) {
      return {
        error: 'Invalid token',
        details: error.message,
      };
    }
  }
}
