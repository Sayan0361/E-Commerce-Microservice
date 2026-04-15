import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CartService } from "services/cart.service";

const cartService = new CartService();

export const Cart = async (event : APIGatewayProxyEventV2) => {
    return cartService.CreateCart(event);
}