import { APIGatewayProxyEventV2 } from "aws-lambda";
import { LoginDTO } from "models/dto/login.dto";
import { SignupDTO } from "models/dto/signup.dto";
import { UserRepository } from "repositories/user.repository";
import { inject, injectable } from "tsyringe";
import { GetHashedPassword, GetSalt, GetToken, timeDifference, validateDTO, ValidatePassword, VerifyToken } from "utilities/user.helper";
import { ErrorResponse, SuccessResponse } from "utilities/response";
import { GenerateAccessCode, SendVerificationCode } from "utilities/notification";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { handleUserError } from "utilities/errors";
import { VerificationDTO } from "models/dto/verify.dto";

@injectable()
export class UserService {
    // Dependency injection : Don’t create your dependencies yourself, let something else provide them.
    constructor(
        @inject(UserRepository) private repository: UserRepository
    ) { }

    // Signup, Login and Verify
    async CreateUser(event: APIGatewayProxyEventV2) {
        try {
            const input = await validateDTO(SignupDTO, event.body);

            let phone = input.phone;

            if (!phone.startsWith("+")) {
                if (/^\d{10}$/.test(phone)) {
                    phone = "+91" + phone;
                } else {
                    return ErrorResponse(400, "Phone must include country code");
                }
            }

            const phoneNumber = parsePhoneNumberFromString(phone);

            if (!phoneNumber || !phoneNumber.isValid()) {
                return ErrorResponse(400, "Invalid phone number format");
            }

            const formattedPhone = phoneNumber.number;

            const salt = await GetSalt();
            const hashedPassword = await GetHashedPassword(input.password, salt);

            const data = await this.repository.CreateAccount({
                phone: formattedPhone,
                email: input.email.toLowerCase().trim(),
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

        } catch (error) {
            return handleUserError(error);
        }
    }

    async UserLogin(event: APIGatewayProxyEventV2) {
        try {
            const input = await validateDTO(LoginDTO, event.body);

            const userDetails = await this.repository.FindAccountByEmail(input.email);

            const verifyPassword = await ValidatePassword(
                input.password,
                userDetails.password,
                userDetails.salt
            );

            if (!verifyPassword) {
                return ErrorResponse(
                    400,
                    `Invalid Email/Password`
                );
            }

            // generate a token
            const token = GetToken(userDetails);

            return SuccessResponse({ token: token });

        } catch (error) {
            return handleUserError(error);
        }
    }

    async GetVerificationToken(event: APIGatewayProxyEventV2) {
        try {
            const authHeaders = event.headers.authorization;
            if (!authHeaders) {
                return ErrorResponse(
                    400,
                    `Auth Headers are missing`
                );
            }

            const payload = await VerifyToken(authHeaders);

            if (!payload || !payload.user_id) {
                return ErrorResponse(
                    403,
                    `Invalid token`
                );
            }

            const { code, expiry } = GenerateAccessCode();

            // save on db to confirm verification later
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
                message: `Verification code is sent to your registered phone number`
            })
        } catch (error) {
            return handleUserError(error);
        }
    }

    async VerifyUser(event: APIGatewayProxyEventV2) {
        try {
            const authHeaders = event.headers.authorization;

            if (!authHeaders) {
                return ErrorResponse(400, "Auth Headers are missing");
            }

            const payload = await VerifyToken(authHeaders);

            if (!payload?.user_id) {
                return ErrorResponse(403, "Invalid token");
            }

            const input = await validateDTO(VerificationDTO, event.body);

            const user = await this.repository.FindAccountByEmail(payload.email);

            if (!user) {
                return ErrorResponse(404, "User not found");
            }

            if (user.verification_code !== input.code) {
                return ErrorResponse(403, "Invalid verification code");
            }

            if (new Date() > new Date(user.expiry)) {
                return ErrorResponse(403, "Verification code expired");
            }

            await this.repository.UpdateVerifyUser(payload.user_id);

            return SuccessResponse({
                message: "User successfully verified"
            });
        } catch (error) {
            return handleUserError(error);
        }
    }
}