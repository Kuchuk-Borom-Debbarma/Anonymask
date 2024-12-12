import { InjectRepository } from '@nestjs/typeorm';
import PostDTO from '../../api/dto/PostDTO';
import { PostService } from '../../api/services/PostService';
import Post from '../domain/Post';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { PostNotFoundException } from 'src/post/api/exceptions/exceptions';

@Injectable()
export default class PostServiceImpl implements PostService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  async createPost(postData: {
    title: string;
    content: string;
  }): Promise<PostDTO> {
    const _postID = v4();
    const currentTimestamp = new Date();

    const newPost = this.postRepo.create({
      postID: _postID,
      title: postData.title,
      content: postData.content,
      createdAt: currentTimestamp,
      updatedAt: null,
    });

    const savedPost = await this.postRepo.save(newPost);

    return this.toDTO(savedPost);
  }

  async getPostById(postId: string): Promise<PostDTO | null> {
    console.log(`Getting post with id ${postId}`);
    const post = await this.postRepo.findOne({
      where: {
        postID: postId,
      },
    });
    if (!post) {
      return null;
    }
    return this.toDTO(post);
  }

  async updatePost(
    postId: string,
    postData: { title?: string; content: string },
  ): Promise<PostDTO | null> {
    try {
      const post = await this.getPostById(postId);
      if (!post) {
        throw new Error(`Post with ID ${postId} not found`);
      }
      if (postData.title !== undefined) {
        post.title = postData.title;
      }
      post.content = postData.content;
      post.updatedAt = new Date();
      const updatedPost = await this.postRepo.save(post);
      return this.toDTO(updatedPost);
    } catch (error) {
      console.error(`Error updating post ${postId}:`, error);
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    await this.postRepo.delete(postId);
  }

  private toDTO(post: Post): PostDTO | null {
    if (!post) return null;
    return {
      postID: post.postID,
      title: post.title,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      content: post.content,
    };
  }
}
