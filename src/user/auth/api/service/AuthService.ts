export default abstract class AuthService {
  
/** 
 * Generates a Google OAuth URL which can be used by a user to log in.
 * The URL directs the user to Google's OAuth login page where they can authenticate and grant access.
 *
 * @returns A string containing the Google OAuth URL.
 */
abstract generateGoogleOAuthURL(): string;

/**
 * Retrieves user information from the OAuth token received after a successful Google OAuth login.
 * This function exchanges the provided OAuth refresh token and state for user details.
 *
 * @param code - The OAuth refresh token received from the Google OAuth login redirect.
 * @param state - A unique state ID received from the Google OAuth login redirect for security purposes.
 *
 * @returns A User DTO (Data Transfer Object) containing the user's details fetched from the OAuth response.
 */
abstract getUserInfoFromOAuthToken(code: string, state: string): Promise<any>;


}
