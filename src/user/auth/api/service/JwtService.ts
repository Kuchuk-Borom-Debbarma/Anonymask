import { UserAccessTokenDTO } from '../dto/UserAccessTokenDTO';

export default abstract class JwtService {
  /**
   * Generates a JSON Web Token (JWT) with the provided claims and subject.
   *
   * @param claims - A map containing key-value pairs that represent the claims to include in the JWT payload.
   * @param subject - The subject (typically a user identifier) for whom the token is being generated.
   * @returns A string representing the signed JWT.
   */
  abstract generateJwt(claims: Map<string, string>, subject: string): string;

  /**
   * Verifies the signature of a given JWT token to ensure its authenticity and integrity.
   * This function checks the token's signature against the public key to verify that it was not tampered with.
   *
   * @param token - The JWT token whose signature needs to be verified.
   *
   * @returns An object containing the decoded payload if the signature is valid, or an error message if invalid.
   */
  abstract verifySignature(token: string): UserAccessTokenDTO; //might need to change this any later
}
