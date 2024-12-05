import { Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from '@nestjs/jwt';
import JwtService from "../api/service/JwtService";

@Injectable()
export default class JwtServiceImpl implements JwtService{
  constructor(private readonly jwtService: NestJwtService) {}

  generateJwt(claims: Map<string, string>, subject: string): string {
    const claimsObject = Object.fromEntries(claims);
    const payload = { ...claimsObject, sub: subject };

    return this.jwtService.sign(payload);
  }
  verifySignature(token: string) {
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