import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostNotFoundException } from 'src/post/api/exceptions/exceptions';
import PostServiceImpl from 'src/post/internal/application/PostServiceImpl';
import Post from 'src/post/internal/domain/Post';
import { DataSource } from 'typeorm';

describe('PostServiceImpl Integration', () => {
  let postService: PostServiceImpl;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              type: 'postgres',
              host: configService.get<string>('DB_HOST'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PWD'),
              database: configService.get<string>('DB_NAME'),
              ssl: {
                rejectUnauthorized: false,
              },
              entities: [Post],
            };
          },
        }),
        TypeOrmModule.forFeature([Post]),
      ],
      providers: [PostServiceImpl],
    }).compile();

    postService = module.get<PostServiceImpl>(PostServiceImpl);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(Post).clear();
  });

  describe('create post', () => {
    it('should create a post successfully', async () => {
      const postData = {
        title: 'Test Post Title',
        content: 'Test content of the post',
      };

      const createdPost = await postService.createPost(postData);

      expect(createdPost).toBeDefined();
      expect(createdPost.title).toBe(postData.title);
      expect(createdPost.content).toBe(postData.content);

      const postRepository = dataSource.getRepository(Post);
      const savedPost = await postRepository.findOne({
        where: { postID: createdPost.postID },
      });

      expect(savedPost).toBeTruthy();
      expect(savedPost.postID).toBe(createdPost.postID);
      expect(savedPost.title).toBe(postData.title);
      expect(savedPost.content).toBe(postData.content);
    });
  });

  describe('get post by ID', () => {
    it('should return null if post does not exist', async () => {
      const post = await postService.getPostById('non-existent-id');
      expect(post).toBeNull();
    });

    it('should return a valid post if it exists', async () => {
      const postData = {
        title: 'Test Post Title',
        content: 'Test content of the post',
      };

      const createdPost = await postService.createPost(postData);

      const foundPost = await postService.getPostById(createdPost.postID);
      expect(foundPost).toBeDefined();
      expect(foundPost.postID).toBe(createdPost.postID);
      expect(foundPost.title).toBe(createdPost.title);
      expect(foundPost.content).toBe(createdPost.content);
    });

    describe('updatePost', () => {
      it('should update a post successfully', async () => {
        const title = 'Test Post';
        const content = 'Test content';

        const newPost = await postService.createPost({ title, content });
        const postId = newPost.postID;
        expect(newPost).toBeDefined();
        expect(newPost.title).toBe(title);
        expect(newPost.content).toBe(content);

        const updatedTitle = 'Updated Test Post';
        const updatedContent = 'Updated content';

        const updatedPost = await postService.updatePost(postId, {
          title: updatedTitle,
          content: updatedContent,
        });

        expect(updatedPost).toBeDefined();
        expect(updatedPost.title).toBe(updatedTitle);
        expect(updatedPost.content).toBe(updatedContent);

        const savedPost = await dataSource
          .getRepository(Post)
          .findOne({ where: { postID: postId } });

        expect(savedPost).toBeDefined();
        expect(savedPost?.title).toBe(updatedTitle);
        expect(savedPost?.content).toBe(updatedContent);
      });
      
    });
    describe('deletePost', () => {
      it('should delete a post', async () => {
        const postId = 'test-post-id';
        const title = 'Test Post';
        const content = 'Test content';
  
        // Create a new post
        const newPost = await postService.createPost({ title, content });
  
        expect(newPost).toBeDefined();
        expect(newPost.title).toBe(title);
        expect(newPost.content).toBe(content);
  
        // Delete the post
        await postService.deletePost(postId);
  
        // Try to find the deleted post
        const deletedPost = await dataSource
          .getRepository(Post)
          .findOne({ where: { postID: postId } });
  
        // The post should be deleted
        expect(deletedPost).toBeNull();
      });
    });
  });
  
});
