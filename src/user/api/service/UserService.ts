import UserDTO from '../dto/UserDTO';

export default abstract class UserService {
  /**
   * Get a user by ID
   * @param userId userID of the user
   * @return UserDTO or null if user was not found.
   */
  abstract getUserById(userId: string): Promise<UserDTO | null>;

  /**
   * Create a user
   * @param userId ID of the user
   * @param name name of the user
   * @param password password of the user
   * @throws UserAlreadyExists exception if record with same userID exists
   */
  abstract createUser(
    userId: string,
    name: string,
    password: string,
  ): Promise<UserDTO>;
}
