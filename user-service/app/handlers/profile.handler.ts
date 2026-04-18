import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ProfileService } from "services/profile.service";
import { ErrorResponse } from "utilities/response";

const profileService = new ProfileService();

export const Profile = async (event: APIGatewayProxyEventV2) => {
    const method = event.requestContext.http.method.toUpperCase();

    const methodMap: Record<string, Function> = {
        POST: profileService.CreateProfile.bind(profileService),
        GET: profileService.GetProfile.bind(profileService),
        PUT: profileService.EditProfile.bind(profileService),
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
