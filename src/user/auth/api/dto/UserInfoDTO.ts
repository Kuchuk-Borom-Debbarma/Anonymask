export interface UserInfoDTO {
  name: string;
  id: string;
}

export interface GoogleUserInfoDTO extends UserInfoDTO {
  sub: string;
  given_name: string;
  family_name: string;
  picture?: string;
  email_verified: boolean;
}