export default abstract class PostService {
  abstract createPost(): void;
  abstract deletePost(postID: string): void;
  abstract updatePost(postID: string): void;
}
