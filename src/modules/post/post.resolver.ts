import { Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {

    constructor(
        private readonly postService: PostService
    ) {}
}
