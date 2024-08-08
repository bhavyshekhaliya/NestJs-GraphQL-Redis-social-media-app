import { ObjectType } from "@nestjs/graphql";
import { AbstractSchema } from "src/common/database/abstract.schema";

@ObjectType()
export class Post extends AbstractSchema {

}