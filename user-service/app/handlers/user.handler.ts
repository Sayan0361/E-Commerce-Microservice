import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "services/user.service";

const userService = new UserService();

export const Signup = (event : APIGatewayProxyEventV2) => {
    return userService.CreateUser(event);
}

export const Login = (event : APIGatewayProxyEventV2) => {
    return userService.UserLogin(event);
}

export const Verify = (event : APIGatewayProxyEventV2) => {
    return userService.VerifyUser(event);
}