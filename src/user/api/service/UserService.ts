import UserDTO from '../dto/UserDTO';

export default interface UserService {
  /**
   * Get a user by ID
   * @param userId userID of the user
   * @return UserDTO or null if user was not found.
   */
  getUserById(userId: string): Promise<UserDTO | null>;

  /**
   * Create a user
   * @param userId ID of the user
   * @throws UserAlreadyExists exception if record with same userID exists
   */
  createUser(userId:string) : Promise<void>;
}
