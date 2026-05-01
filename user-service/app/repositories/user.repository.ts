import { UserModel } from "models/user.model";
import { pool } from "utilities/database.client";
import { injectable } from "tsyringe";

@injectable()
export class UserRepository {
    async CreateAccount({
        phone,
        email,
        password,
        salt,
        user_type,
        first_name,
        last_name
    }: UserModel) {

        const query = `
            INSERT INTO users(
                phone,
                email,
                password,
                salt,
                user_type,
                first_name,
                last_name
            )
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        const values = [
            phone,
            email,
            password,
            salt,
            user_type,
            first_name,
            last_name
        ];

        try {
            const result = await pool.query(query, values);

            if (!result.rows.length) {
                throw new Error("User creation failed");
            }

            return result.rows[0] as UserModel;

        } catch (err: any) {
            console.error("DB query failed:", err.message);

            // Handle unique constraint for duplicate email and phone
            if (err.code === "23505") {
                throw new Error("USER_ALREADY_EXISTS");
            }

            throw err;
        }
    }

    async FindAccountByEmail(email: string) {
        const query = `
            SELECT 
                user_id,
                email,
                password,
                phone,
                verification_code,
                expiry,
                salt
            FROM users
            WHERE 
                email = $1
        `;

        const values = [email];

        try {
            const result = await pool.query(query, values);

            if (result.rows.length < 1) {
                throw new Error("USER_NOT_FOUND");
            }

            return result.rows[0];

        } catch (err: any) {
            console.error("DB query failed:", err.message);

            throw err;
        }
    }

    async UpdateVerificationCode(
        userId: string,
        code: string,
        expiry: Date
    ) {
        const query = `
            UPDATE users 
            SET 
                verification_code = $1,
                expiry = $2
            WHERE user_id = $3
            AND verified = FALSE
            RETURNING *
        `;

        const values = [code, expiry, userId];

        const result = await pool.query(query, values);

        if (!result.rows.length) {
            throw new Error("USER_ALREADY_VERIFIED");
        }

        return result.rows[0] as UserModel;
    }

    async UpdateVerifyUser(
        userId: string
    ) {
        const query = `
            UPDATE users 
            SET 
                verified = TRUE
            WHERE user_id = $1
            AND verified = FALSE
            RETURNING *
        `;

        const values = [userId];

        const result = await pool.query(query, values);

        if (!result.rows.length) {
            throw new Error("USER_ALREADY_VERIFIED");
        }

        return result.rows[0] as UserModel;
    }
}