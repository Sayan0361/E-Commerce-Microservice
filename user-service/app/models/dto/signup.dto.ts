import { 
    IsNotEmpty, 
    Matches, 
    IsEmail, 
    IsIn, 
    IsOptional, 
    MinLength 
} from "class-validator";

export class SignupDTO {

    @IsEmail({}, { message: "Invalid email format" })
    email!: string;

    @MinLength(6, { message: "Password must be at least 6 characters" })
    password!: string;

    @IsNotEmpty({ message: 'Phone Number is required' })
    @Matches(/^(\+[1-9]\d{9,14}|\d{10})$/, {
        message: "Phone must be E.164 or 10-digit local number"
    })
    phone!: string;

    @IsNotEmpty({ message: "User type is required" })
    @IsIn(["BUYER", "SELLER"], {
        message: "User type must be BUYER or SELLER"
    })
    user_type!: "BUYER" | "SELLER";

    @IsOptional()
    @Matches(/^[A-Za-z]+$/, {
        message: "First name must contain only letters"
    })
    first_name?: string;

    @IsOptional()
    @Matches(/^[A-Za-z]+$/, {
        message: "Last name must contain only letters"
    })
    last_name?: string;
}