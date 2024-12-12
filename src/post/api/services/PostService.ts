import PostDTO from '../dto/PostDTO';

export abstract class PostService {
  /**
   * Create a new post
   * @param postData The data required to create a new post, including title and content
   * @return The created PostDTO object containing the post details
   */
  abstract createPost(postData: {
    title: string;
    content: string;
  }): Promise<PostDTO>;

  /**
   * Get a post by its ID
   * @param postId The ID of the post to retrieve
   * @return A PostDTO object representing the post, or null if the post was not found
   */
  abstract getPostById(postId: string): Promise<PostDTO | null>;

  /**
   * Update an existing post
   * @param postId The ID of the post to be updated
   * @param postData The data used to update the post, including optional title and required content
   * @return void
   */
  abstract updatePost(
    postId: string,
    postData: {
      title?: string;
      content: string;
    },
  ): Promise<PostDTO |null>;

  /**
   * Delete a post by its ID
   * @param postId The ID of the post to delete
   * @return void
   */
  abstract deletePost(postId: string): Promise<void>;
}
