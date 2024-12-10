import UserDTO from '../dto/UserDTO';
import UserFieldDTO from '../dto/UserFieldDTO';

export default abstract class UserService {
  /**
   * Get a base user info by ID
   * @param userId userID of the user
   * @return UserDTO or null if user was not found.
   */
  abstract getBaseUserById(userId: string): Promise<UserDTO | null>;

  /**
   * Get all the fields that are being used by the user
   * @param userId userId to get fields of
   * @return UserFieldDTO or null if user was not found
   */
  abstract getAllUserFields(userId: string): Promise<null | UserFieldDTO>;

  /**
   * Get specified fields of the user. If field is absent for user it will not be included
   * @param userId
   * @param fieldIds
   */
  abstract getUserFieldValue(
    userId: string,
    fieldIds: string[],
  ): Promise<UserFieldDTO | null>;

  /**
   * Create a user with base info
   * @param userId ID of the user
   * @param name name of the user
   * @throws UserAlreadyExists exception if record with same userID exists
   */
  abstract createBaseUser(
    userId: string,
    name: string,
  ): Promise<UserDTO>;

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
