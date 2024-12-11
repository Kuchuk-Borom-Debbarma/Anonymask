import UserDTO from '../dto/UserDTO';

export default abstract class UserService {
  /**
   * Get a base user info by ID
   * @param userId userID of the user
   * @return UserDTO or null if user was not found.
   */
  abstract getBaseUserById(userId: string): Promise<UserDTO | null>;

  /**
   * Create a user with base info
   * @param userId ID of the user
   * @param name name of the user
   * @throws UserAlreadyExists exception if record with same userID exists
   */
  abstract createBaseUser(userId: string, name: string): Promise<UserDTO>;

  /**
   * Update user info
   * @param userId id of the user
   * @param baseInfo basic information
   * @param fieldInfo field mapped information
   */
  abstract updateUser(
    userId: string,
    baseInfo?: {
      username?: string;
    },
    fieldInfo?: Map<string, string>,
  ): Promise<void>;
}
