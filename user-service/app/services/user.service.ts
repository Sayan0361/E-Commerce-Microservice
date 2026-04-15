import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SuccessResponse } from "utilities/response";

export class UserService {
    constructor() {
        
    }

    // Signup, Login and Verify
    async CreateUser(event : APIGatewayProxyEventV2) {
        console.log(event);
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