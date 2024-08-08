import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {

    constructor(
        private readonly postRepository: PostRepository
    ) {}
}
