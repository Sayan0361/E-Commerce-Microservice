import { AppError } from "./app.error";

export class UserNotFoundError extends AppError {
    constructor() {
        super(404, "User not found");
    }
}

export class UserAlreadyExistsError extends AppError {
    constructor() {
        super(409, "User already exists");
    }
}

export class InvalidCredentialsError extends AppError {
    constructor() {
        super(401, "Invalid email or password");
    }
}

export class UserAlreadyVerifiedError extends AppError {
    constructor() {
        super(409, "User is already verified");
    }
}

export class UserCreationFailedError extends AppError {
    constructor() {
        super(500, "Failed to create user");
    }
}

export class UserUpdateFailedError extends AppError {
    constructor() {
        super(500, "Failed to update user");
    }
}

export class InvalidPhoneNumberError extends AppError {
    constructor() {
        super(400, "Invalid phone number");
    }
}

export class InvalidTokenError extends AppError {
    constructor() {
        super(401, "Invalid token");
    }
}

export class MissingAuthHeaderError extends AppError {
    constructor() {
        super(401, "Authorization header missing");
    }
}

export class VerificationCodeExpiredError extends AppError {
    constructor() {
        super(403, "Verification code expired");
    }
}

export class InvalidVerificationCodeError extends AppError {
    constructor() {
        super(403, "Invalid verification code");
    }
}

export class UpdatingAddressError extends AppError {
    constructor() {
        super(400, "Error while updating the address");
    }
}