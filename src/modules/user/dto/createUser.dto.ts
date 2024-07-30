import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

@InputType()
export class CreateUserDto {

    @Field(() => String, { nullable: true })
    @IsString({ message: "User name must be a string" })
    @IsNotEmpty({ message: "user name is required" })
    userName: string;

    @Field()
    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password is required" })
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
        }
    )
    password: string;
}
