import "../boostrap";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { PaymentService } from "services/payment.service";
import { ErrorResponse } from "utilities/response";


const paymentService = new PaymentService();

export const Payment = async (event: APIGatewayProxyEventV2) => {
    const method = event.requestContext.http.method.toUpperCase();

    const methodMap: Record<string, Function> = {
        POST: paymentService.CreatePaymentMethod.bind(paymentService),
        GET: paymentService.GetPaymentMethod.bind(paymentService),
        PUT: paymentService.UpdatePaymentMethod.bind(paymentService),
    };

    const handler = methodMap[method];

    if (!handler) {
        return ErrorResponse(
            404, 
            `method not supported`
        );
    }

    return handler(event);
};