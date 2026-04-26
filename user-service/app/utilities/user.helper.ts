import bcrypt from "bcryptjs";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "utilities/errors";
import { ErrorResponse } from "utilities/response";
import jwt from "jsonwebtoken";
import { UserModel } from "models/user.model";

/* PASSWORD UTILS */
export const GetSalt = async () => {
    return await bcrypt.genSalt();
};

export const GetHashedPassword = async (
    password: string,
    salt: string
) => {
    return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
) => {
    return (
        await GetHashedPassword(enteredPassword, salt)
    ) === savedPassword;
};

export const GetToken = (user: UserModel) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET_NOT_CONFIGURED");
    }

    return jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            phone: user.phone,
            userType: user.userType
        },
        secret,
        { expiresIn: "30d" }
    );
};

export const VerifyToken = async (
    authHeader?: string
): Promise<UserModel> => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET_NOT_CONFIGURED");
    }

    if (!authHeader) {
        throw new Error("TOKEN_MISSING");
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new Error("INVALID_TOKEN_FORMAT");
    }

    const token = parts[1];

    try {
        const payload = jwt.verify(token, secret);

        if (typeof payload !== "object" || !payload) {
            throw new Error("INVALID_TOKEN_PAYLOAD");
        }

        return payload as UserModel;

    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            throw new Error("TOKEN_EXPIRED");
        }

        throw new Error("INVALID_TOKEN");
    }
};

/* VALIDATION  */
export const validateDTO = async <T>(
    dto: new () => T,
    body: unknown
): Promise<T> => {
    if (!body) {
        throw new Error("INVALID_BODY");
    }

    const parsed =
        typeof body === "string" ? JSON.parse(body) : body;

    const input = plainToClass(dto, parsed);

    const error = await AppValidationError(input);

    if (error) {
        throw new Error("VALIDATION_ERROR");
    }

    return input;
};

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