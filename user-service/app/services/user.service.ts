import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "repositories/user.repository";
import { autoInjectable } from "tsyringe";
import { SuccessResponse } from "utilities/response";

@autoInjectable()
export class UserService {
    // Dependency injection : Don’t create your dependencies yourself, let something else provide them.
    repository: UserRepository;
    constructor(repository : UserRepository) {
        this.repository = repository;
    }

    // Signup, Login and Verify
    async CreateUser(event : APIGatewayProxyEventV2) {
        const body = event.body;
        console.log(body);

        await this.repository.CreateUserOperation();
        return SuccessResponse({
            message : "Successfully created"
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