import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "services/user.service";
import { container } from "tsyringe";

// DI Container(tsyringe) -> This container automatically creates dependencies for you
// So u dont need to do : 
// const repo = new UserRepository();
// const userService = new UserService(repo);
const userService = container.resolve(UserService);


// middy -> Express-style middleware for Lambda
export const Signup = middy((event : APIGatewayProxyEventV2) => {
    return userService.CreateUser(event);
}).use(
    bodyParser()
)

export const Login = (event : APIGatewayProxyEventV2) => {
    return userService.UserLogin(event);
}

export const Verify = (event : APIGatewayProxyEventV2) => {
    return userService.VerifyUser(event);
}