export abstract class StalkService {
  /**
   * Initiates stalking of a user.
   * @param stalkerId - The ID of the user who wants to stalk.
   * @param stalkedId - The ID of the user to be stalked.
   * @returns {Promise<boolean | null>}
   * - `true` if stalking was successfully initiated.
   * - `false` if stalking could not be initiated.
   * - `null` if an error occurred.
   */
  abstract stalk(stalkerId: string, stalkedId: string): Promise<boolean | null>;

  /**
   * Stops stalking a user.
   * @param stalkerId - The ID of the user who is currently stalking.
   * @param stalkedId - The ID of the user being stalked.
   * @returns {Promise<boolean | null>}
   * - `true` if stalking was successfully stopped.
   * - `false` if stopping the stalking failed.
   * - `null` if an error occurred.
   */
  abstract stopStalking(
    stalkerId: string,
    stalkedId: string,
  ): Promise<boolean | null>;

  /**
   * Checks if a user is stalking another user.
   * @param stalkerId - The ID of the user who may be stalking.
   * @param stalkedId - The ID of the user who may be stalked.
   * @returns {Promise<boolean | null>}
   * - `true` if the stalker is actively stalking the target.
   * - `false` if the stalker is not stalking the target.
   * - `null` if an error occurred.
   */
  abstract isStalking(
    stalkerId: string,
    stalkedId: string,
  ): Promise<boolean | null>;

  /**
   * Retrieves the list of stalkers for a user.
   * @param userId - The ID of the user whose stalkers are to be fetched.
   * @param pagination - Optional pagination settings:
   * - `skip`: The number of stalkers to skip.
   * - `limit`: The maximum number of stalkers to retrieve.
   * If omitted, only the total count will be returned.
   * @returns {Promise<{ stalkers?: string[]; count: number } | null>}
   * - An object containing:
   *   - `stalkers`: A list of stalker IDs (if pagination is provided).
   *   - `count`: The total number of stalkers.
   * - `null` if an error occurred.
   */
  abstract getStalkers(
    userId: string,
    pagination?: { skip: number; limit: number },
  ): Promise<{
    stalkers?: string[];
    count: number;
  } | null>;

  /**
   * Retrieves the list of users being stalked by a user.
   * @param userId - The ID of the user whose stalking list is to be fetched.
   * @param pagination - Optional pagination settings:
   * - `skip`: The number of users to skip.
   * - `limit`: The maximum number of users to retrieve.
   * If omitted, only the total count will be returned.
   * @returns {Promise<{ stalking?: string[]; count: number } | null>}
   * - An object containing:
   *   - `stalking`: A list of user IDs being stalked (if pagination is provided).
   *   - `count`: The total number of users being stalked.
   * - `null` if an error occurred.
   */
  abstract getStalking(
    userId: string,
    pagination?: { skip: number; limit: number },
  ): Promise<{
    stalking?: string[];
    count: number;
  } | null>;

  abstract getStalkCounts(userId: string): Promise<{
    stalking: number;
    stalker: number;
  }>;
}
