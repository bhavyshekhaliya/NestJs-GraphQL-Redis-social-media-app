import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { AbstractSchema } from "src/common/database/abstract.schema";

@ObjectType()
export class User extends AbstractSchema {

    @Field(() => String)
    userName: string

    @HideField()
    password: string

    @Field(() => String, { nullable: true })
    accessToken?: string

    @Field(() => String, { nullable: true })
    refreshToken?: string

    @Field(() => String, { nullable: true })
    profileImageUrl: string
}
