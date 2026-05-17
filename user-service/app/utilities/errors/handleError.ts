import { AppError } from "utilities/errors/app.error";
import { ErrorResponse } from "../response";

export const handleError = (error: unknown) => {

    console.error(error);

    if (error instanceof AppError) {
        return ErrorResponse(
            error.statusCode,
            error.message,
            error.details
        );
    }

    return ErrorResponse(
        500,
        "Internal server error"
    );
};