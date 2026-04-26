import { IsNotEmpty, Matches } from "class-validator";
import { LoginDTO } from "./login.dto";

export class SignupDTO extends LoginDTO {

    @IsNotEmpty({ message: 'Phone Number is required' })
    @Matches(/^(\+[1-9]\d{9,14}|\d{10})$/, {
        message: "Phone must be E.164 or 10-digit local number"
    })
    phone!: string;
}