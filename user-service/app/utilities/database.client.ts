import { Pool } from "pg";

const getEnv = (key: string, fallback?: string) => {
    const value = process.env[key] || fallback;

    if (!value) {
        throw new Error(`Missing env: ${key}`);
    }

    return value;
};

export const pool = new Pool({
    host: getEnv("POSTGRES_HOST", "127.0.0.1"),
    user: getEnv("POSTGRES_USER"),
    password: getEnv("POSTGRES_PASSWORD"),
    database: getEnv("POSTGRES_DB"),
    port: Number(getEnv("POSTGRES_PORT", "5432")),
});

pool.on("connect", () => {
    console.log("DB pool connected");
});

pool.on("error", (err) => {
    console.error("DB pool error:", err.message);
});