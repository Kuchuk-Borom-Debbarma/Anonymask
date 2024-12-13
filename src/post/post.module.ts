import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './internal/domain/Post';
import { PostService } from './api/services/PostService';
import PostServiceImpl from './internal/application/PostServiceImpl';

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