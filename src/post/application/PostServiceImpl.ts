import PostDTO from '../api/dto/PostDTO';
import { PostService } from '../api/services/PostService';

export default class PostServiceImpl implements PostService {
  createPost(postData: { title: string; content: string }): Promise<PostDTO> {
    throw new Error('Method not implemented.');
  }
  getPostById(postId: string): Promise<PostDTO | null> {
    throw new Error('Method not implemented.');
  }
  updatePost(
    postId: string,
    postData: { title?: string; content: string },
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deletePost(postId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
