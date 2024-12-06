import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from '@nestjs/jwt';
import JwtService from "../api/service/JwtService";

@Injectable()
export default class JwtServiceImpl implements JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateJwt(claims: Map<string, string>, subject: string): string {
    if (!subject || subject.trim() === '') {
      throw new BadRequestException('Subject is required');
    }

    if (claims.size === 0) {
      throw new BadRequestException('Claims cannot be empty');
    }

    const claimsObject = Object.fromEntries(claims);
    const payload = { ...claimsObject, sub: subject };

    return this.jwtService.sign(payload);
  }
  
  verifySignature(token: string): any {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      return {
        error: 'Invalid token',
        details: error.message
      };
    }
  }
}