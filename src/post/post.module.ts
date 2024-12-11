import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './domain/Post';
import { PostService } from './api/services/PostService';
import PostServiceImpl from './application/PostServiceImpl';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
  ],
  providers: [
    {
      provide: PostService,
      useClass: PostServiceImpl,
    },
  ],
  exports: [PostService],
})
export class PostModule {}