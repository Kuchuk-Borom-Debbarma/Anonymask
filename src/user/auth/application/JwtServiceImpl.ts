import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import JwtService from '../api/service/JwtService';
import { ConstantsEnvNames } from '../../../util/Constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class JwtServiceImpl implements JwtService {
  constructor(private readonly jwtService: NestJwtService, private configService: ConfigService) { }

  // Summary: This function generates a JWT token with optional claims and subject.
  // Default claims (issuer and issued at) are included if no claims are provided.
  // If a subject is supplied, it is added to the token payload.

  generateJwt(claims?: Map<string, string>, subject?: string): string {
    const defaultClaims: Record<string, string | number> ={
      iss: 'AnonyMask',
      iat: Math.floor(Date.now() / 1000),
    };

    const claimsObject: Record<string, string | number> = claims && claims.size > 0
      ? { ...defaultClaims, ...Object.fromEntries(claims) }
      : defaultClaims;

    if (subject && subject.trim() !== '') {
      claimsObject.sub = subject;
    }

    return this.jwtService.sign(claimsObject, {
      secret: this.configService.get<string>(
        ConstantsEnvNames.JWT_SECRET,
      ),
      expiresIn: this.configService.get<string>(
        ConstantsEnvNames.JWT_EXPIRES_IN
      ),
      algorithm: 'HS256',
    });
  }

  // Summary: This function verifies the authenticity of a JWT token by checking its signature using the predefined secret and algorithm.
  // If valid, it returns the decoded token; otherwise, it returns an error message with details.

  verifySignature(token: string): any {
    try {
      // @ts-ignore
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>(
          ConstantsEnvNames.JWT_SECRET
        ),
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
