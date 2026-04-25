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

            // Handle unique constraint
            if (err.code === "23505") {
                throw new Error("User already exists");
            }

            throw err;
        }
    }
}