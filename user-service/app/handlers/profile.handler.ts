import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ProfileService } from "services/profile.service";

const profileService = new ProfileService();

export const Profile = async (event : APIGatewayProxyEventV2) => {
    return profileService.CreateProfile(event);
}