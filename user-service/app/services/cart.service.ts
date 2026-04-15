import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SuccessResponse } from "utilities/response";

export class CartService {
    constructor() {
        
    }

    // CART 
    async CreateCart(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }

    async GetCart(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }

    async UpdateCart(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }
}