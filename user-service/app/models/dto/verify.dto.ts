import { Length } from "class-validator";

export class VerificationDTO {
    @Length(6)
    code! : string;
}