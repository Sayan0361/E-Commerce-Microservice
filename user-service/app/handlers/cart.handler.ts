import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CartService } from "services/cart.service";
import { ErrorResponse } from "utilities/response";

const cartService = new CartService();

export const Cart = async (event: APIGatewayProxyEventV2) => {
    const method = event.requestContext.http.method.toUpperCase();

    const methodMap: Record<string, Function> = {
        POST: cartService.CreateCart.bind(cartService),
        GET: cartService.GetCart.bind(cartService),
        PUT: cartService.UpdateCart.bind(cartService),
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