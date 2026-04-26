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
        userType
    }: UserModel) {

        const query = `
            INSERT INTO users(
                phone,
                email,
                password,
                salt,
                user_type
            )
            VALUES($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [phone, email, password, salt, userType];

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

    async FindAccountByEmail(email : string) {
        const query = `
            SELECT 
                user_id,
                email,
                password,
                phone,
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
}