import {
    IsNotEmpty,
    IsOptional,
    Matches,
    MinLength,
    MaxLength,
} from "class-validator";

export class AddressDTO {
    id!: number;

    @IsNotEmpty()
    @MinLength(3, {
        message: "Address line 1 must be at least 3 characters"
    })
    address_line1!: string;

    @IsOptional()
    @MinLength(3, {
        message: "Address line 2 must be at least 3 characters"
    })
    address_line2?: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    @Matches(/^[A-Za-z\s]+$/, {
        message: "City must contain only letters"
    })
    city!: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    @Matches(/^[A-Za-z0-9\s-]+$/, {
        message: "Invalid postal code format"
    })
    post_code!: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    @Matches(/^[A-Za-z\s]+$/, {
        message: "Country must contain only letters"
    })
    country!: string;
}