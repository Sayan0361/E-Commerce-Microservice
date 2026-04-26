import "reflect-metadata";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "services/user.service";
import { container } from "tsyringe";

// DI Container(tsyringe) -> This container automatically creates dependencies for you
// So u dont need to do : 
// const repo = new UserRepository();
// const userService = new UserService(repo);
// const userService = container.resolve(UserService);


// middy -> Express-style middleware for Lambda
const withService = <T>(
    fn: (service: UserService, event: APIGatewayProxyEventV2) => Promise<T>
) => {
    return middy(async (event: APIGatewayProxyEventV2) => {
        const service = container.resolve(UserService);

        try {
            return await fn(service, event);
        } catch (error) {
            console.error("Handler error:", error);

            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" })
            };
        }
    }).use(bodyParser());
};

const methodRouter = <T>(
    service: UserService,
    event: APIGatewayProxyEventV2,
    routes: Record<string, (event: APIGatewayProxyEventV2) => Promise<T>>
) => {
    const method = event.requestContext.http.method;

    const handler = routes[method];

    if (!handler) {
        return Promise.resolve({
            statusCode: 405,
            body: JSON.stringify({ message: "Method not allowed" })
        });
    }

    return handler(event);
};

export const Signup = withService((service, event) =>
    service.CreateUser(event)
);

export const Login = withService((service, event) =>
    service.UserLogin(event)
);

// if method is get -> GetVerificationToken
// if method is post -> VerifyUser
export const Verify = withService((service, event) =>
    methodRouter(service, event, {
        GET: service.GetVerificationToken.bind(service),
        POST: service.VerifyUser.bind(service),
    })
);
