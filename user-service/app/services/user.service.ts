import { APIGatewayProxyEventV2 } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { SignupDTO } from "models/dto/signup.dto";
import { UserRepository } from "repositories/user.repository";
import { inject, injectable } from "tsyringe";
import { AppValidationError } from "utilities/errors";
import { GetHashedPassword, GetSalt } from "utilities/password";
import { ErrorResponse, SuccessResponse } from "utilities/response";

@injectable()
export class UserService {
    // Dependency injection : Don’t create your dependencies yourself, let something else provide them.
    constructor(
        @inject(UserRepository) private repository: UserRepository
    ) {}
    // Signup, Login and Verify
    async CreateUser(event : APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(
                SignupDTO,
                event.body
            );

            const validationError = await AppValidationError(input);

            if(validationError) {
                return ErrorResponse(
                    400,
                    validationError
                );
            }

            const salt = await GetSalt();

            const hashedPassword = await GetHashedPassword(
                input.password,
                salt
            );
            
            const data = await this.repository.CreateAccount({
                    phone : input.phone,
                    email : input.email,
                    password : hashedPassword,
                    salt : salt,
                    userType : "BUYER"
                }
            );


            return SuccessResponse({
                data
            });
        }
        catch(error) {
            console.log("Error from Create User : ", error);
            return ErrorResponse(500, "Internal server error");
        }
        
    }

    async UserLogin(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully logged in"
        });
    }

    async VerifyUser(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }
}