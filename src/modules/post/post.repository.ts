import { Injectable, Logger } from "@nestjs/common";
import { MongoRespository } from "src/common/database/mongo.repository";
import { PostDocument } from "./entites/post.document]";
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./entites/post.entity";
import { Model } from "mongoose";

@Injectable()
export class PostRepository extends MongoRespository<PostDocument> {
    protected readonly logger = new Logger(PostRepository.name);
    
    constructor(@InjectModel(Post.name) postModel: Model<PostDocument>) {
        super(postModel)
    }
}