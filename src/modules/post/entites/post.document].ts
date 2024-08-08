import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractSchema } from "src/common/database/abstract.schema";

@Schema()
export class PostDocument extends AbstractSchema {

    @Prop()
    caption: string

    @Prop()
    location: string

    @Prop()
    image: string

    @Prop()
    author: Types.ObjectId
}

export const UserSchema = SchemaFactory.createForClass(PostDocument);