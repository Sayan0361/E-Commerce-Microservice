import bcrypt from "bcryptjs";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "utilities/errors";
import jwt from "jsonwebtoken";
import { UserModel } from "models/user.model";
import dayjs from "dayjs";

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

export const timeDifference = (
    fromDate : string,
    toDate : string,
    type : "d" | "h" | "m"
) => {
    const startDate = dayjs(fromDate);
    return startDate.diff(
        dayjs(toDate),
        type,
        true
    );
}