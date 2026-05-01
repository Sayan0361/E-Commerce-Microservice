import { validate, ValidationError } from "class-validator";
import { ErrorResponse } from "./response";

export const AppValidationError = async (
    input : any
) : Promise<ValidationError[] | false> => {
    const error = await validate(
        input,
        {
            ValidationError : { target : true}
        }
    );

    if(error.length) {
        return error;
    }

    return false;
}

/* ERROR HANDLER */
export const handleUserError = (error: unknown) => {
    console.error("Service error:", error);

    if (error instanceof Error) {
        switch (error.message) {

            /* -------- AUTH / TOKEN -------- */
            case "TOKEN_MISSING":
                return ErrorResponse(401, "Authorization token missing");

            case "INVALID_TOKEN_FORMAT":
                return ErrorResponse(401, "Invalid token format");

            case "INVALID_TOKEN":
                return ErrorResponse(401, "Invalid token");

            case "TOKEN_EXPIRED":
                return ErrorResponse(401, "Token expired");


            /* -------- USER -------- */
            case "USER_ALREADY_EXISTS":
                return ErrorResponse(409, "User already exists");

            case "USER_NOT_FOUND":
                return ErrorResponse(404, "User not found");

            case "USER_ALREADY_VERIFIED":
                return ErrorResponse(409, "User is already verified");

            /* -------- VALIDATION -------- */
            case "INVALID_BODY":
                return ErrorResponse(400, "Invalid request body");

            case "VALIDATION_ERROR":
                return ErrorResponse(400, "Validation failed");

            /* -------- CONFIG -------- */
            case "JWT_SECRET_NOT_CONFIGURED":
                return ErrorResponse(500, "Server configuration error");
        }
    }

    /* -------- FALLBACK -------- */
    return ErrorResponse(500, "Internal server error");
};