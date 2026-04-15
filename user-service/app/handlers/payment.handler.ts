import { APIGatewayProxyEventV2 } from "aws-lambda";
import { PaymentService } from "services/payment.service";


const paymentService = new PaymentService();

export const Payment = async (event : APIGatewayProxyEventV2) => {
    return paymentService.CreatePaymentMethod(event);
}