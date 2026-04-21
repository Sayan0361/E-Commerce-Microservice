import { IsNotEmpty, Length } from "class-validator";
import { LoginDTO } from "./login.dto";

export class SignupDTO extends LoginDTO {
    @IsNotEmpty({ message: 'Phone Number is required and cannot be empty' })
    @Length(10, 13, { message: 'Phone Number must be of minimum 10 digits and maximum 13 digits' })
    phone! : string;
}
