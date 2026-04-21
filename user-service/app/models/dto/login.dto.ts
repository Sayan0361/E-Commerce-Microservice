import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginDTO {
    // Output if invalid: "user@invalid is not a valid email"
    @IsNotEmpty({ message: 'Email is required and cannot be empty' })
    @IsEmail({}, { message: '$value is not a valid $property' })
    email! : string;

    @IsNotEmpty({ message: 'Password is required and cannot be empty' })
    @Length(6, 32, { message: 'Password must be between 6 and 32 characters' })
    password! : string;
}