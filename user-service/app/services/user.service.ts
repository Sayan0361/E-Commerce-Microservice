import { APIGatewayProxyEventV2 } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { SignupDTO } from "models/dto/signup.dto";
import { UserRepository } from "repositories/user.repository";
import { autoInjectable } from "tsyringe";
import { AppValidationError } from "utilities/errors";
import { GetHashedPassword, GetSalt } from "utilities/password";
import { ErrorResponse, SuccessResponse } from "utilities/response";

@autoInjectable()
export class UserService {
    // Dependency injection : Don’t create your dependencies yourself, let something else provide them.
    repository: UserRepository;
    constructor(repository : UserRepository) {
        this.repository = repository;
    }

    // Signup, Login and Verify
    async CreateUser(event : APIGatewayProxyEventV2) {
        const SignupBody = event.body;
        
        const input = plainToClass(
            SignupDTO,
            SignupBody
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
                email : input.email,
                password : hashedPassword,
                phone : input.phone,
                userType : "BUYER",
                salt : salt
            }
        );


        return SuccessResponse({
            data
        });
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