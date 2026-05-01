import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Transform } from "class-transformer";

export class LoginDTO {

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    @Length(1, 255)
    @Transform(({ value }) => value.toLowerCase().trim())
    email!: string;

    @IsNotEmpty({ message: 'Password is required' })
    @Length(6, 32, { message: 'Password must be between 6 and 32 characters' })
    @Transform(({ value }) => value.trim())
    password!: string;
}