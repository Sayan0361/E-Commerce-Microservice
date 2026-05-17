import { ValidationError } from "class-validator";
import { AppError } from "./app.error";

export class RequestValidationError extends AppError {

    constructor(errors: ValidationError[]) {

        const messages = errors.map(err => {
            const constraints = err.constraints;

            return constraints
                ? Object.values(constraints)[0]
                : "Validation failed";
        });

        super(
            400,
            messages[0],
            messages
        );
    }
}