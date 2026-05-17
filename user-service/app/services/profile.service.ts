import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ProfileDTO } from "models/dto/profile.dto";
import { ProfileRepository } from "repositories/profile.repository";
import { inject, injectable } from "tsyringe";
import { InvalidTokenError, MissingAuthHeaderError, UserNotFoundError } from "utilities/errors/errors";
import { ErrorResponse, SuccessResponse } from "utilities/response";
import { validateDTO, VerifyToken } from "utilities/user.helper";

@injectable()
export class ProfileService {
    constructor(
        @inject(ProfileRepository)
        private repository: ProfileRepository
    ) {
    }

    // USER PROFILE
    async CreateProfile(event: APIGatewayProxyEventV2) {
        const authHeaders = event.headers.authorization;

        if (!authHeaders) {
            return new MissingAuthHeaderError();
        }

        const payload = await VerifyToken(authHeaders);

        if (!payload?.user_id) {
            return new InvalidTokenError();
        }
        
        const input = await validateDTO(ProfileDTO, event.body);
        
        await this.repository.CreateProfile(
            payload.user_id,
            input
        );

        return SuccessResponse({
            message : `Profile created successfully!`,
        })
    }

    async GetProfile(event: APIGatewayProxyEventV2) {
        const authHeaders = event.headers.authorization;

        if (!authHeaders) {
            return new MissingAuthHeaderError();
        }

        const payload = await VerifyToken(authHeaders);

        if (!payload?.user_id) {
            return new InvalidTokenError();
        }

        const result = await this.repository.GetUserProfile(
            payload.user_id
        );

        return SuccessResponse({
            data : result,
            message: `Profile fetched successfully`
        });
    }

    async EditProfile(event: APIGatewayProxyEventV2) {
        const authHeaders = event.headers.authorization;

        if (!authHeaders) {
            return new MissingAuthHeaderError();
        }

        const payload = await VerifyToken(authHeaders);

        if (!payload?.user_id) {
            return new InvalidTokenError();
        }
        
        const input = await validateDTO(ProfileDTO, event.body);

        await this.repository.EditProfile(
            payload.user_id,
            input
        );

        return SuccessResponse({
            message: `Profile updated successfully`
        });
    }
}