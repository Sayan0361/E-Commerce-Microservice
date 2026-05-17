import { ProfileDTO } from "models/dto/profile.dto";
import { injectable, inject } from "tsyringe";
import {
    UpdatingAddressError,
    UserNotFoundError,
    UserUpdateFailedError
} from "utilities/errors/errors";

import { UserRepository } from "./user.repository";
import { pool } from "utilities/database.client";
import { UserModel } from "models/user.model";
import { PoolClient } from "pg";
import { AddressModel } from "models/address.model";

@injectable()
export class ProfileRepository {

    constructor(
        @inject(UserRepository)
        private userRepository: UserRepository
    ) {}

    async UpdateUser(
        user_id: number,
        first_name: string,
        last_name: string,
        user_type: string,
        client: PoolClient | typeof pool = pool
    ) {

        const query = `
            UPDATE users
            SET 
                first_name = $2,
                last_name = $3,
                user_type = $4
            WHERE user_id = $1
            RETURNING *
        `;

        const values = [
            user_id,
            first_name,
            last_name,
            user_type
        ];

        try {

            const result = await client.query(query, values);

            if (!result.rows.length) {
                throw new UserNotFoundError();
            }

            return result.rows[0] as UserModel;

        } catch (err: any) {

            console.error("UpdateUser failed:", err.message);

            if (err instanceof UserNotFoundError) {
                throw err;
            }

            throw new UserUpdateFailedError();
        }
    }

    async CreateProfile(
        user_id: number,
        {
            first_name,
            last_name,
            user_type,
            address: {
                address_line1,
                address_line2,
                city,
                post_code,
                country
            }
        }: ProfileDTO
    ) {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            // Update user
            const updatedUser = await this.UpdateUser(
                user_id,
                first_name!,
                last_name!,
                user_type,
                client
            );

            // Insert address
            const query = `
                INSERT INTO address(
                    user_id,
                    address_line1,
                    address_line2,
                    city,
                    post_code,
                    country
                )
                VALUES($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;

            const values = [
                user_id,
                address_line1,
                address_line2,
                city,
                post_code,
                country
            ];

            await client.query(query, values);

            await client.query("COMMIT");

            return true;

        } catch (err: any) {

            await client.query("ROLLBACK");

            console.error("CreateProfile failed:", err.message);

            if (err instanceof UserNotFoundError) {
                throw err;
            }

            throw new UserUpdateFailedError();

        } finally {

            client.release();
        }
    }

    async GetUserProfile(
        user_id : number
    ) {
        const profileQuery = `
            SELECT 
                first_name,
                last_name,
                email,
                phone,
                user_type,
                verified
            FROM users 
            WHERE user_id = $1
        `;

        const profileValues = [user_id];

        const profileResult = await pool.query(profileQuery, profileValues);

        if(!profileResult.rows.length) {
            throw new UserNotFoundError();
        }

        const userProfile = profileResult.rows[0] as UserModel;

        const addressQuery = `
            SELECT 
                id,
                address_line1,
                address_line2,
                city,
                post_code,
                country
            FROM address
            WHERE user_id = $1
        `;

        const addressValues = [user_id];

        const addressResult = await pool.query(addressQuery, addressValues);

        if(addressResult.rows.length) {
            userProfile.address = addressResult.rows[0] as AddressModel[];
        }

        return userProfile;
    }

    async EditProfile(
        user_id: number,
        {
            first_name,
            last_name,
            user_type,
            address: {
                address_line1,
                address_line2,
                city,
                post_code,
                country,
                id
            }
        }: ProfileDTO
    ) {
        await this.UpdateUser(
                user_id,
                first_name!,
                last_name!,
                user_type
        );

        const addressQuery = `
            UPDATE address
            SET 
                address_line1 = $1,
                address_line2 = $2,
                city = $3,
                post_code = $4,
                country = $5
            WHERE id = $6 AND user_id = $7
            RETURNING *
        `;

        const addressValues = [
            address_line1,
            address_line2,
            city,
            post_code,
            country,
            id,
            user_id
        ];

        try {
            const addressResult = await pool.query(addressQuery, addressValues);

            if(!addressResult.rows.length) {
                throw new UpdatingAddressError();
            }

            return true;
        } catch (err: any) {
            console.error("EditProfile - Address update failed:", err.message);
            
            if (err instanceof UpdatingAddressError) {
                throw err;
            }
            
            throw new UpdatingAddressError();
        }
    }
}