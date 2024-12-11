export class PostNotFoundException extends Error {
  constructor(postId: string) {
    super(`Post with ID ${postId} not found`);
    this.name = 'PostNotFoundException';
  }
}
