import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SuccessResponse } from "utilities/response";

export class PaymentService {
    constructor() {
        
    }

    // PAYMENT
    async CreatePaymentMethod(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }

    async GetPaymentMethod(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }

    async UpdatePaymentMethod(event : APIGatewayProxyEventV2) {
        console.log(event);
        return SuccessResponse({
            message : "Successfully verified"
        });
    }
}