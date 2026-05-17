import "reflect-metadata";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { container } from "tsyringe";

import { ProfileService } from "services/profile.service";
import { ErrorResponse } from "utilities/response";

const withService = <T>(
    fn: (
        service: ProfileService,
        event: APIGatewayProxyEventV2
    ) => Promise<T>
) => {
    return middy(async (event: APIGatewayProxyEventV2) => {
        const service = container.resolve(ProfileService);

        try {
            return await fn(service, event);
        } catch (error) {
            console.error("Handler error:", error);

            return ErrorResponse(500, "Internal server error");
        }
    }).use(bodyParser({
        disableContentTypeError: true
    }));
};

const methodRouter = <T>(
    service: ProfileService,
    event: APIGatewayProxyEventV2,
    routes: Record<
        string,
        (event: APIGatewayProxyEventV2) => Promise<T>
    >
) => {
    const method = event.requestContext.http.method;

    const handler = routes[method];

    if (!handler) {
        return Promise.resolve(ErrorResponse(405, "Method not allowed"));
    }

    return handler(event);
};

export const Profile = withService((service, event) =>
    methodRouter(service, event, {
        POST: (event) => service.CreateProfile.bind(service)(event),
        GET: (event) => service.GetProfile.bind(service)(event),
        PUT: (event) => service.EditProfile.bind(service)(event),
    })
);