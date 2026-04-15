import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SuccessResponse } from "utilities/response";

export class ProfileService {
    constructor() {
        
    }

    // USER PROFILE
    async CreateProfile(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }

    async GetProfile(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }

    async EditProfile(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }
}