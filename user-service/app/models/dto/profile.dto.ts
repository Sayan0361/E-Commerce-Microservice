import { IsIn, IsOptional, Matches, ValidateNested } from "class-validator";
import { AddressDTO } from "./address.dto";
import { Type } from "class-transformer";

export class ProfileDTO {
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

    @IsIn(["BUYER", "SELLER"])
    user_type!: string;

    @ValidateNested()
    @Type(() => AddressDTO)
    address!: AddressDTO;
}