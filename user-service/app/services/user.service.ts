import { APIGatewayProxyEventV2 } from "aws-lambda";
import { LoginDTO } from "models/dto/login.dto";
import { SignupDTO } from "models/dto/signup.dto";
import { UserRepository } from "repositories/user.repository";
import { inject, injectable } from "tsyringe";
import { GetHashedPassword, GetSalt, GetToken, handleUserError, validateDTO, ValidatePassword, VerifyToken } from "utilities/user.helper";
import { ErrorResponse, SuccessResponse } from "utilities/response";
import { GenerateAccessCode, SendVerificationCode } from "utilities/notification";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@injectable()
export class UserService {
    // Dependency injection : Don’t create your dependencies yourself, let something else provide them.
    constructor(
        @inject(UserRepository) private repository: UserRepository
    ) { }

    // Signup, Login and Verify
    async CreateUser(event: APIGatewayProxyEventV2) {
        try {
            const input = await validateDTO(SignupDTO,event.body);
            
            if (!input.phone.startsWith("+")) {
                if (/^\d{10}$/.test(input.phone)) {
                    input.phone = "+91" + input.phone; // only for valid Indian format
                } else {
                    return ErrorResponse(400, "Phone must include country code");
                }
            }

            const phoneNumber = parsePhoneNumberFromString(input.phone);
            
            if (!phoneNumber || !phoneNumber.isValid()) {
                return ErrorResponse(400, "Invalid phone number format");
            }

            // normalize number 
            const formattedPhone = phoneNumber.number; // E.164 format

            const salt = await GetSalt();

            const hashedPassword = await GetHashedPassword(
                input.password,
                salt
            );

            const data = await this.repository.CreateAccount({
                phone: formattedPhone,
                email: input.email,
                password: hashedPassword,
                salt: salt,
                userType: "BUYER"
            });

            return SuccessResponse({ data });

        } catch (error) {
            return handleUserError(error);
        }
    }

    async UserLogin(event: APIGatewayProxyEventV2) {
        try {
            const input = await validateDTO(LoginDTO,event.body);

            const userDetails = await this.repository.FindAccountByEmail(input.email);
            
            const verifyPassword = await ValidatePassword(
                input.password,
                userDetails.password,
                userDetails.salt
            );

            if(!verifyPassword) {
                return ErrorResponse(
                    400,
                    `Invalid Email/Password`
                );
            }

            // generate a token
            const token = GetToken(userDetails);

            return SuccessResponse({ token : token});

        } catch (error) {
            return handleUserError(error);
        }
    }

    async GetVerificationToken(event: APIGatewayProxyEventV2) {
        const authHeaders = event.headers.authorization;
        const payload = await VerifyToken(authHeaders);
        if(payload) {
            const { code, expiry } = GenerateAccessCode();
            // save on db to confirm verification later
            const response = await SendVerificationCode(
                payload.phone, 
                code
            );
            return SuccessResponse({
                message: `Verification code is sent to your registered phone number`
            })
        }
    }

    async VerifyUser(event: APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message: "Successfully verified"
        });
    }
}