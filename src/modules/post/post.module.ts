import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PostRepository } from './post.repository';

@Module({
  imports: [],
  providers: [
    PostService, 
    PostResolver,
    PostRepository
  ]
})
export class PostModule {}
