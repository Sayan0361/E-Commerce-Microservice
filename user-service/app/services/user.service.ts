import { APIGatewayProxyEventV2 } from "aws-lambda";

import { LoginDTO } from "models/dto/login.dto";
import { SignupDTO } from "models/dto/signup.dto";
import { VerificationDTO } from "models/dto/verify.dto";

import { UserRepository } from "repositories/user.repository";
import { inject, injectable } from "tsyringe";

import {
    GetHashedPassword,
    GetSalt,
    GetToken,
    validateDTO,
    ValidatePassword,
    VerifyToken
} from "utilities/user.helper";

import { SuccessResponse } from "utilities/response";
import { GenerateAccessCode } from "utilities/notification";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import {
    InvalidCredentialsError,
    InvalidPhoneNumberError,
    InvalidTokenError,
    InvalidVerificationCodeError,
    MissingAuthHeaderError,
    VerificationCodeExpiredError
} from "utilities/errors/errors";

@injectable()
export class UserService {

    constructor(
        @inject(UserRepository)
        private repository: UserRepository
    ) {}

    async CreateUser(event: APIGatewayProxyEventV2) {

        const input = await validateDTO(
            SignupDTO,
            event.body
        );

        let phone = input.phone;

        if (!phone.startsWith("+")) {

            if (/^\d{10}$/.test(phone)) {
                phone = "+91" + phone;
            } else {
                throw new InvalidPhoneNumberError();
            }
        }

        const phoneNumber =
            parsePhoneNumberFromString(phone);

        if (!phoneNumber?.isValid()) {
            throw new InvalidPhoneNumberError();
        }

        const formattedPhone = phoneNumber.number;

        const salt = await GetSalt();

        const hashedPassword =
            await GetHashedPassword(
                input.password,
                salt
            );

        const data =
            await this.repository.CreateAccount({
                phone: formattedPhone,
                email: input.email
                    .toLowerCase()
                    .trim(),
                password: hashedPassword,
                salt,
                user_type: input.user_type,
                first_name: input.first_name,
                last_name: input.last_name
            });

        return SuccessResponse({
            user_id: data.user_id,
            email: data.email,
            phone: data.phone
        });
    }

    async UserLogin(event: APIGatewayProxyEventV2) {

        const input = await validateDTO(
            LoginDTO,
            event.body
        );

        const userDetails =
            await this.repository
                .FindAccountByEmail(input.email);

        const validPassword =
            await ValidatePassword(
                input.password,
                userDetails.password,
                userDetails.salt
            );

        if (!validPassword) {
            throw new InvalidCredentialsError();
        }

        const token = GetToken(userDetails);

        return SuccessResponse({ token });
    }

    async GetVerificationToken(
        event: APIGatewayProxyEventV2
    ) {

        const authHeaders =
            event.headers.authorization;

        if (!authHeaders) {
            throw new MissingAuthHeaderError();
        }

        const payload =
            await VerifyToken(authHeaders);

        if (!payload?.user_id) {
            throw new InvalidTokenError();
        }

        const { code, expiry } =
            GenerateAccessCode();

        await this.repository.UpdateVerificationCode(
            payload.user_id,
            code.toString(),
            expiry
        );

        // send the code : currently not using to save my bills lol
        // await SendVerificationCode(
        //     payload.phone, 
        //     code
        // );

        console.log(code, expiry);

        return SuccessResponse({
            message:
                "Verification code sent successfully"
        });
    }

    async VerifyUser(
        event: APIGatewayProxyEventV2
    ) {

        const authHeaders =
            event.headers.authorization;

        if (!authHeaders) {
            throw new MissingAuthHeaderError();
        }

        const payload =
            await VerifyToken(authHeaders);

        if (!payload?.user_id) {
            throw new InvalidTokenError();
        }

        const input =
            await validateDTO(
                VerificationDTO,
                event.body
            );

        const user =
            await this.repository
                .FindAccountByEmail(payload.email);

        if (user.verification_code !== input.code) {
            throw new InvalidVerificationCodeError();
        }

        if (new Date() > new Date(user.expiry)) {
            throw new VerificationCodeExpiredError();
        }

        await this.repository.UpdateVerifyUser(
            payload.user_id
        );

        return SuccessResponse({
            message:
                "User successfully verified"
        });
    }
}