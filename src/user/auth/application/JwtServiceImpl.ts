import { Injectable } from "@nestjs/common";
import JwtService from "../api/service/JwtService";

@Injectable()
export default class JwtServiceImpl implements JwtService{


  generateJwt(claims: Map<string, string>, subject: string): string {
    throw new Error("Method not implemented.");
  }
  verifySignature(token: string) {
    throw new Error("Method not implemented.");
  }

}