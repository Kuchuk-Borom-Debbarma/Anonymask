import { Injectable } from "@nestjs/common";
import GoogleAuthService from "../api/service/AuthService";


@Injectable()
export default class GoogleAuthServiceImpl implements GoogleAuthService {
  
  constructor(){
    
  }

  
  
  
  generateGoogleOAuthURL(): string {
    throw new Error("Method not implemented.");
  }
  getUserInfoFromOAuthToken(code: string, state: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

}